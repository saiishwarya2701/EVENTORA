const nodemailer=require('nodemailer');
const dotenv=require('dotenv');
dotenv.config();

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    },
}); 

exports.sendOtpEmail=async(email,otp,type)=>{
    try{
    const title=type==='account_verification'?'Account Verification':'Event Booking';
    const msg=type==='account_verification'?'Please use the following OTP to verify your account.':'Please use the following OTP to complete your event booking.';
    const mailOptions={
        from:process.env.EMAIL_USER,        
        to:email,
        subject:'Your OTP for Eventora',
        html: `
         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #4CAF50;">${title}</h2>
            <p>${msg}</p>
            <p><strong>Your OTP is: ${otp}</strong></p>
            <p>This OTP will expire in <strong>5 minutes</strong>.</p>
            <hr />
            <p style="font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
        </div>
    `,
    };
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email} for ${type} `);

}
catch(error){
    console.error(`Error sending OTP email to ${email}:`,error);
}
};

exports.sendBookingEmail=async(email,eventTitle,bookingId)=>{
    try {
        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:'Your Eventora booking confirmation',
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #4CAF50;">Booking Confirmed</h2>
                    <p>Your booking for <strong>${eventTitle}</strong> has been confirmed.</p>
                    <p><strong>Booking ID:</strong> ${bookingId}</p>
                    <hr />
                    <p style="font-size: 12px; color: #888;">Thanks for using Eventora.</p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Booking email sent to ${email} for ${eventTitle}`);
    } catch (error) {
        console.error(`Error sending booking email to ${email}:`, error);
    }
};