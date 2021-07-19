const categoryModel = require('../models/categoryModel');
const ProductsModel = require('../models/productModel');


const categoryCtrl = {
    getCategorys: async (req, res) => {
        try {
            const categorys = await categoryModel.find()
            res.json(categorys)
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    CreateCategorys: async (req, res) => {
        try {
            const { name } = req.body
            const category = await categoryModel.findOne({ name })
            if (category) return res.status(400).json({ msg: "Category đã tồn tại" })
            const newCategory = new categoryModel({ name })
            await newCategory.save()
            res.json({ msg: "Thêm mới thành công" })

        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    DeleteCategorys: async (req, res) => {
        try {
            const products = await ProductsModel.findOne({ category: req.params.id })
            if (products) return res.status(400).json({
                msg: "Vui lòng xóa hết các sản phẩm có mối quan hệ"
            })

            await categoryModel.findByIdAndDelete(req.params.id)
            res.json({ msg: "Xóa thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    upadateCategorys: async (req, res) => {
        try {
            const { name } = req.body
            await categoryModel.findByIdAndUpdate({ _id: req.params.id }, { name })
            res.json({ msg: "Update thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    }
}

module.exports = categoryCtrl