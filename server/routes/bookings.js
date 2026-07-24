const express=require('express');
const router=express.Router();
const {protect,admin}=require('../middleware/auth');
const {bookEvent,sendBookingOTP,getMyBookings,confirmBooking,cancelBooking,getAllBookings}=require('../controller/bookingController');

//send otp for booking
router.post('/send-otp',protect,sendBookingOTP);

//get my bookings - MUST come before /:id routes
router.get('/my',protect,getMyBookings);

// admin: get all bookings
router.get('/',protect,admin,getAllBookings);

//post booking
router.post('/',protect,bookEvent);

//confirm booking
router.put('/:id/confirm',protect,admin,confirmBooking);

//cancel booking
router.delete('/:id',protect,cancelBooking);

module.exports=router;