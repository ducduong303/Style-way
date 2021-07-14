const router = require('express').Router();
const auth = require('../middlewares/auth');
const authAdmin = require('../middlewares/authAdmin');
const ProductsCtrl = require('../controllers/productsCtrl');


router.post("/", auth, authAdmin, ProductsCtrl.createProduct)
router.get("/", ProductsCtrl.getAllProduct)
router.get("/:id", ProductsCtrl.getDetailProduct)
router.delete("/:id", auth, authAdmin, ProductsCtrl.deleteProduct);
router.post("/delete_all_products", auth, authAdmin, ProductsCtrl.deleteAllProduct);
router.post("/:id", auth, authAdmin, ProductsCtrl.updateProduct);

router.put("/review", auth, ProductsCtrl.createReviewProduct);
router.get("/reviews/:id", ProductsCtrl.getListReview);
router.post("/delete_review/:id", auth, ProductsCtrl.deleteReview);


module.exports = router