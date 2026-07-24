const Booking=require('../models/Bookings.js');
const Event=require('../models/Event');
const User=require('../models/User');
const OTP=require('../models/otp');
const {sendOtpEmail,sendBookingEmail}=require('../utils/email');

const generateOtp=()=>{
    return Math.floor(100000 + Math.random() * 900000).toString();
}
exports.sendBookingOTP=async(req,res)=>{
    const otp=generateOtp();
    await OTP.findOneAndDelete({email:req.user.email,action:'event_booking'});
    await OTP.create({email:req.user.email,otp,action:'event_booking'});
    await sendOtpEmail(req.user.email,otp,'event_booking');
    res.status(200).json({message:'OTP sent to your email for booking confirmation'});
}

exports.bookEvent=async(req,res)=>{
    const {eventId,otp}=req.body;
    const otpRecord=await OTP.findOne({email:req.user.email,otp,action:'event_booking'});
    if(!otpRecord){
        return res.status(400).json({message:'Invalid or expired OTP'});
    }   
    const event=await Event.findById(eventId);
    if(!event){
        return res.status(404).json({message:'Event not found'});
    }
    if(event.availableSeats<=0){
        return res.status(400).json({message:'No available seats for this event'});
    }
    const existingBooking=await Booking.findOne({
        userId:req.user._id,
        eventId,
    });
    if(existingBooking){
        return res.status(400).json({message:'You have already booked this event'});
    }
    const booking=await Booking.create({
        userId:req.user._id,
        eventId,
        status:'pending',
        paymentStatus:'non_paid',
        amount:event.ticketPrice,
    });
    await OTP.deleteMany({email:req.user.email,action:'event_booking'});
    
    res.status(201).json({message:'Booking created successfully ,Please check your email for booking details',booking});
}
 

exports.confirmBooking=async(req,res)=>{
    const paymentStatus=req.body.paymentStatus;
    if(!['paid','non_paid'].includes(paymentStatus)){
        return res.status(400).json({message:'Invalid payment status'});
    }
    const booking=await Booking.findById(req.params.id).populate('eventId').populate('userId');
    if(!booking){
        return res.status(404).json({message:'Booking not found'});
    }
    if(booking.status==='confirmed'){
        return res.status(400).json({message:'Booking is already confirmed'});
    }
    if(booking.status!=='pending'){
        return res.status(400).json({message:'Only pending bookings can be confirmed'});
    }
    const event=await Event.findById(booking.eventId._id);
    if(!event){
        return res.status(404).json({message:'Event not found'});
    }
    if(event.availableSeats<=0){
        return res.status(400).json({message:'No available seats for this event'});
    }
    booking.status='confirmed';
    booking.paymentStatus=paymentStatus;
    await booking.save();
    event.availableSeats-=1;
    await event.save();
    //admin confirm booking, email to booking owner
    await sendBookingEmail(booking.userId.email, event.title, booking._id);
    res.status(200).json({message:'Booking confirmed successfully',booking});
}
exports.getAllBookings=async(req,res)=>{
    const bookings=await Booking.find().populate('eventId').populate('userId');
    res.status(200).json(bookings);
}
exports.getMyBookings=async(req,res)=>{
    const bookings=await Booking.find({userId:req.user._id}).populate('eventId');
    res.status(200).json(bookings);
}
exports.cancelBooking=async(req,res)=>{
    const booking=await Booking.findById(req.params.id);
    if(!booking){
        return res.status(404).json({message:'No bookings found for this user'});
    }
    if(booking.userId.toString()!==req.user._id.toString()){
        return res.status(403).json({message:'You are not authorized to view these bookings'});
    }

    if(booking.status==='confirmed'){
        const event=await Event.findById(booking.eventId);
        if(event){
            event.availableSeats += 1;
            await event.save();
        }
    }

    await booking.deleteOne();
    res.status(200).json({message:'Booking cancelled successfully'});
}