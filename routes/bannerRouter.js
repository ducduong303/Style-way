const router = require('express').Router();
const bannerCtrl = require('../controllers/bannerCtrl');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

router.get("/", auth, bannerCtrl.getBanners)
router.post("/", auth, authAdmin, bannerCtrl.createBanner)
router.delete("/:id", auth, authAdmin, bannerCtrl.deleteBanner)

module.exports = router