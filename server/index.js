const express=require('express');
const dotenv=require('dotenv');
const cors = require('cors');
const dns=require('dns');
const fs = require('fs');
const path = require('path');
const mongoose=require('mongoose');
const authRoutes=require('./routes/auth');
const eventRoutes=require('./routes/events');
const bookingRoutes=require('./routes/bookings');
dotenv.config();
dns.setServers(['1.1.1.1','8.8.8.8']);
const app=express();
app.use(cors({
  origin: [
    'https://saiishwarya2701.github.io',
    'http://localhost:5173',
  ],
  credentials: true,
}));
app.use(express.json());

// API routes
app.use('/api/auth',authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/bookings',bookingRoutes);

// Serve React frontend from client/dist when available
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((error)=>{
    console.error('Error connecting to MongoDB:', error);
});

const PORT =process.env.PORT||5000;

app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}`)
});






