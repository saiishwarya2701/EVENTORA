const mongoose = require('mongoose');
const dotenv = require('dotenv');
const OTP = require('../models/Otp');

dotenv.config();

const email = process.argv[2];
if(!email){
    console.error('Usage: node getOtp.js <email>');
    process.exit(1);
}

async function run(){
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        const otp = await OTP.findOne({email, action: 'event_booking'}).sort({createdAt:-1}).lean();
        if(!otp){
            console.log('No OTP found for', email);
        } else {
            console.log('Found OTP:', otp.otp);
        }
        await mongoose.disconnect();
        process.exit(0);
    }catch(err){
        console.error('Error:', err);
        process.exit(1);
    }
}

run();
