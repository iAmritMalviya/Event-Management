const express = require('express');
const Router = express.Router();
const controller = require('../controllers/index');
const multer = require('multer'); // node module for uploading & retrieving the files
const {auth, essentialMiddlewares} = require('../middlewares/index') // middleware for authetication
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  // Create the Multer middleware
  const upload = multer({ storage: storage });


// GET: API for getting all the events
Router.get('/events', auth.isLoggedIn, controller.event.get)
// upload.single('image), upload is multer function, single is for uploading single photo, image is the name of the file, coming from the client side
// POST: API for creating an event
Router.post('/events', [auth.isLoggedIn,upload.single('image')], controller.event.create)
// PUT: API for editing an event
Router.put('/events/:Id',  [auth.isLoggedIn,upload.single('image')], controller.event.edit)
// DELETE: API for deleting an event
Router.delete('/events/:Id',[auth.isLoggedIn], controller.event.delete)

module.exports = Router