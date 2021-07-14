const router = require('express').Router();
const uploadImage = require('../middlewares/uploadImage');
const uploadCtrl = require('../controllers/uploadCtrl');
const auth = require('../middlewares/auth');

router.post("/upload", uploadImage, auth, uploadCtrl.uploadImage)

router.post("/destroy-image", auth, uploadCtrl.deleteImage)

module.exports = router