const router = require('express').Router();
const blogCtrl = require('../controllers/blogCtrl');
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');


router.get("/", blogCtrl.getBlogs)
router.get("/:id", blogCtrl.getDetailBlog)
router.post("/", auth, authAdmin, blogCtrl.createBlog)
router.delete("/:id", auth, authAdmin, blogCtrl.deleteBlog)
router.put("/:id", auth, authAdmin, blogCtrl.updateBlog)



module.exports = router