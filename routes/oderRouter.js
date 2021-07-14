const router = require('express').Router();
const oderCtrl = require('../controllers/oderCtrl');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');


router.get("/", auth, authAdmin, oderCtrl.getAllOder)
router.post("/delete_all", auth, authAdmin, oderCtrl.deleteAllOder)
router.get("/me", auth, oderCtrl.getHistoryOder)
router.get("/:id", auth, oderCtrl.getOderDetail)
router.post("/", auth, oderCtrl.createOder)
router.put("/:id", auth, authAdmin, oderCtrl.updateOder)
router.post("/:id", auth, oderCtrl.useDestroyOder)
router.delete("/:id", auth, authAdmin, oderCtrl.deleteOder)




module.exports = router