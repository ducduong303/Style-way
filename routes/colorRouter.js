const router = require('express').Router();
const colorCtrl = require('../controllers/colorCtrl');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');


router.get("/", auth, authAdmin, colorCtrl.getColors)
router.post("/", auth, authAdmin, colorCtrl.createColor)
router.delete("/:id", auth, authAdmin, colorCtrl.deleteColors)
router.put("/:id", auth, authAdmin, colorCtrl.upadateColors)
router.post("/delete_all_color", auth, authAdmin, colorCtrl.deleteAllColor)


module.exports = router