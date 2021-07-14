const sizeModel = require('../models/sizeModel');
const ProductsModel = require('../models/productModel');
const flatArr = require('../utils/flatArr');
const APIfeatures = require('../utils/APIfeatures');

const sizeCtrl = {
    getSizes: async (req, res) => {
        try {
            const apiFeatures = new APIfeatures(sizeModel.find(), req.query)
                .search()
                .sort()
                .pagination()
            const sizes = await apiFeatures.query
            const totalItem = await sizeModel.find()
            res.json({
                sizes,
                totalItem: totalItem.length
            })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    createSizes: async (req, res) => {
        try {
            const { name } = req.body
            const size = await sizeModel.findOne({ name })
            if (size) return res.status(400).json({ msg: "Size này đã tồn tại" })
            const newSize = new sizeModel({ name })
            await newSize.save()
            res.json({ msg: "Thêm mới thành công", newSize })

        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    deleteAllSizes: async (req, res) => {
        try {
            const rs = await sizeModel.deleteMany({ _id: { $in: req.body.check } })
            res.json({ msg: "Xóa thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    deleteSizes: async (req, res) => {
        try {
            const sizes = await sizeModel.findById(req.params.id)
            const products = await ProductsModel.find();
            const size = sizes.name
            const arrSize = []
            products.map((item, index) => {
                arrSize.push(item.sizes)
            })
            const flat = [...new Set(flatArr(arrSize))]
            const isCheck = flat.includes(size)

            if (isCheck) {
                return res.status(400).json({
                    msg: "Size đang tồn tại trong một sản phẩm"
                })
            }
            await sizeModel.findByIdAndDelete(req.params.id)
            res.json({ msg: "Xóa thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    upadateSizes: async (req, res) => {
        try {
            const { name } = req.body
            await sizeModel.findByIdAndUpdate({ _id: req.params.id }, { name })
            res.json({ msg: "Update thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    }
}

module.exports = sizeCtrl