const ProductsModel = require('../models/productModel');
const APIfeatures = require('../utils/APIfeatures');


const productCtrl = {
    createProduct: async (req, res) => {
        try {
            const { name, images, category, description, sizes, price, colors, countInStock } = req.body
            const newProduct = new ProductsModel({
                name, images, category, description, sizes, price, colors, countInStock
            })
            await newProduct.save()
            res.json({
                msg: "Thêm mới thành công",
                newProduct
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { name, images, category, description, sizes, price, colors, countInStock } = req.body
            const product = await ProductsModel.findOneAndUpdate({ _id: req.params.id }, {
                name, images, category, description, sizes, price, colors, countInStock
            })
            res.json({ msg: "Update Thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getAllProduct: async (req, res) => {
        try {

            const { category } = req.query
            const apiFeatures = new APIfeatures(ProductsModel.find(), req.query)
                .search()
                .filter()
                .sort()
                .pagination()
                .category()
                .sizes()
                .colors()

            const products = await apiFeatures.query
            const totalItem = await ProductsModel.find()


            const productsCategore = await ProductsModel.find({ category: category })

            res.json({
                msg: "Thành công",
                products,
                resultFilter: productsCategore.length,
                totalItem: totalItem.length
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params
            await ProductsModel.findByIdAndDelete({ _id: id })
            res.json({ msg: "Xóa thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    deleteAllProduct: async (req, res) => {
        try {
            const rs = await ProductsModel.deleteMany({ _id: { $in: req.body.check } })
            res.json({ msg: "Xóa thành công" })

        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    getDetailProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const products = await ProductsModel.findById(id)
            res.json(products)
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    createReviewProduct: async (req, res) => {
        try {
            const { rating, comment, productId, images } = req.body;
            const review = {
                user: req.user.id,
                productId: productId,
                rating: rating,
                comment: comment,
                images: images
            }

            const product = await ProductsModel.findById(productId)
            if (!product) return res.status(400).json({ msg: "Sản phẩm này không tồn tại" })

            // Check user đã từng review chưa
            // const isReviewed = product.reviews.find(r => r.user.toString() === req.user.id.toString())
            // if (isReviewed) {
            //     product.reviews.forEach(review => {
            //         if (review.user.toString() === req.user.id.toString()) {
            //             review.comment = comment;
            //             review.rating = rating
            //             review.images = images
            //         }
            //     })
            // } else {
            //     product.reviews.push(review)
            //     product.numberReview = product.reviews.length
            // }
            product.reviews.push(review)
            product.numberReview = product.reviews.length

            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
            await product.save()
            res.json({ msg: "thành công", product })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getListReview: async (req, res) => {
        try {
            const { id } = req.params;

            const product = await ProductsModel.findById(id)
                .populate({
                    path: 'reviews.user',
                    select: 'name avatar'
                })

            if (!product) return res.status(400).json({ msg: "Sản phẩm này không tồn tại" })


            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const reviews = product.reviews.slice(startIndex, endIndex)
            res.json({
                msg: "thành công",
                reviews,
                totalItem: product.reviews.length
                // reviews: product.reviews
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    deleteReview: async (req, res) => {
        try {
            const { id } = req.params;
            const { idReview, user } = req.body

            if (user !== req.user.id) return res.status(400).json({ msg: "Đây không phải review của bạn" })

            const product = await ProductsModel.findById(id)

            // console.log(product)

            let isCheck = false;
            for (var i = 0; i < product.reviews.length; i++) {
                if (product.reviews[i]._id == idReview) {
                    isCheck = true;
                    break;
                }
            }
            if (!isCheck) return res.status(400).json({ msg: "Review này không phải của bạn" })

            const reviews = product.reviews.filter(review => review._id.toString() !== idReview.toString())
            const numberReview = reviews.length
            const rating = reviews.length === 0 ? 0 : reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
            const reviewUpdate = await ProductsModel.findByIdAndUpdate(id, {
                reviews,
                numberReview,
                rating
            }, {
                new: true
            })
            res.json({
                msg: "thành công",
                reviewUpdate
            })
        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
 


}

module.exports = productCtrl 