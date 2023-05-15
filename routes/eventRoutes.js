const express = require('express');
const Router = express.Router();
const controller = require('../controllers/index');
const multer = require('multer'); // node module for uploading & retrieving the files
const {auth} = require('../middlewares/index') // middleware for authetication
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ '--' + file.originalname)  // to make it unique
    }
}); // defining storage in multer

var upload = multer({ storage: storage });


// GET: API for getting all the events
Router.get('/events', auth.isLoggedIn, controller.event.get)
// upload.single('image), upload is multer function, single is for uploading single photo, image is the name of the file, coming from the client side
// POST: API for creating an event
Router.post('/events', upload.single('image'), controller.event.create)
// PUT: API for editing an event
Router.put('/events:Id',  upload.single('image'), controller.event.edit)
// DELETE: API for deleting an event
Router.delete('/events:Id', controller.event.delete)

module.exports = Router