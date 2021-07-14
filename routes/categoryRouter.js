const router = require('express').Router();
const categoryCtrl = require('../controllers/categoryCtrl');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');

router.get("/", categoryCtrl.getCategorys)
router.post("/", auth, authAdmin, categoryCtrl.CreateCategorys)
router.delete("/:id", auth, authAdmin, categoryCtrl.DeleteCategorys)
router.put("/:id", auth, authAdmin, categoryCtrl.upadateCategorys)




module.exports = router