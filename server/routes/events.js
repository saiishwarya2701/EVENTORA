const express=require('express');
const router=express.Router();
const {protect,admin}=require('../middleware/auth');
const {getAllEvents,getEventById,createEvent,updateEvent,deleteEvent}=require('../controller/eventController');
//Get all Events
router.get('/',getAllEvents);

//get event by id
router.get('/:id',getEventById);

//create event(Admin only)
router.post('/',protect,admin,createEvent);

//update event(Admin only)
router.put('/:id',protect,admin,updateEvent);

//delete event(Admin only)
router.delete('/:id',protect,admin,deleteEvent);

module.exports=router;