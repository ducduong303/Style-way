const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');


router.post("/register", userCtrl.register);

router.post("/activation", userCtrl.activateEmail)

router.post("/login", userCtrl.login)

router.get("/refresh_token", userCtrl.getAccessToken)

router.post("/forgot_password", userCtrl.forgotPassword)

router.post("/reset_password", auth, userCtrl.resetPassword)

router.post("/change_password", auth, userCtrl.changePassword)

router.get("/logout", userCtrl.logout)

router.get("/info", auth, userCtrl.getUserInfo)

router.post("/add_user", auth, authAdmin, userCtrl.addUser)

router.get("/all_user", auth, authAdmin, userCtrl.getAllUser)

router.post("/update_user", auth, userCtrl.updateUser)

router.patch("/update_role/:id", auth, authAdmin, userCtrl.updateRole)

router.delete("/delete_user/:id", auth, authAdmin, userCtrl.deleteUser)

router.post("/delete_user_all", auth, authAdmin, userCtrl.deleteUserAll)

router.post("/addCart", auth, userCtrl.addCart)
router.post("/addWishlist", auth, userCtrl.addWishlist)
router.post("/removeWishlist", auth, userCtrl.removeWishList)



// Social Login
router.post("/google_login", userCtrl.googleLogin)
router.post("/facebook_login", userCtrl.facebookLogin)


module.exports = router;