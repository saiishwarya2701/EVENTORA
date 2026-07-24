import React from "react";
import api from "../utils/axios";
export const AuthContext = React.createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);   
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);   
  const login = async (email, password) => {
    try{
        const {data}=await api.post("/auth/login",{email,password});
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        return data;
    }
    catch(error){
        console.error("Login error:", error);
        const message = error.response?.data?.message || error.message || 'Login failed';
        const err = new Error(message);
        err.needsVerification = error.response?.status === 400 && error.response?.data?.message?.includes('verified');
        throw err;
    }
  }
  const register = async (name, email, password) => {
    try {
        const { data } = await api.post("/auth/register", { name, email, password });
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        return data;
    }
    catch (error) {
        console.error("Registration error:", error);
        const message = error.response?.data?.message || error.message || 'Registration failed';
        throw new Error(message);
    }
  }
  const verifyOtp = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      return data;
    }
    catch(error){
        console.error("OTP verification error:", error);
        const message = error.response?.data?.message || error.message || 'OTP verification failed';
        throw new Error(message);
    }
  }
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, verifyOtp ,register }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;