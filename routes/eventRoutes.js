const express = require('express');
const Router = express.Router();
const controller = require('../controllers/index');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+ '--' + file.originalname)  // to make it unique
    }
});

var upload = multer({ storage: storage });

const auth = function (req, res, next) {
    req.uid = 336 
    next()
}

Router.get('/', auth, controller.event.get)
Router.post('/', upload.single('image'), controller.event.create)
Router.put('/:Id',  upload.single('image'), controller.event.edit)
Router.delete('/:Id', controller.event.delete)

module.exports = Router