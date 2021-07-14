const router = require('express').Router();
const sizeCtrl = require('../controllers/sizeCtrl');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');


router.get("/", auth, authAdmin, sizeCtrl.getSizes)
router.post("/", auth, authAdmin, sizeCtrl.createSizes)
router.delete("/:id", auth, authAdmin, sizeCtrl.deleteSizes)
router.put("/:id", auth, authAdmin, sizeCtrl.upadateSizes)
router.post("/delete_all_size", auth, authAdmin, sizeCtrl.deleteAllSizes)


module.exports = router