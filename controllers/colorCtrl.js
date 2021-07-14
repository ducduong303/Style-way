const colorModel = require('../models/colorModel');
const ProductsModel = require('../models/productModel');
const flatArr = require('../utils/flatArr');
const APIfeatures = require('../utils/APIfeatures');

const colorCtrl = {
    getColors: async (req, res) => {
        try {
            const apiFeatures = new APIfeatures(colorModel.find(), req.query)
                .search()
                .sort()
                .pagination()

            const colors = await apiFeatures.query
            const totalItem = await colorModel.find()
            res.json({
                colors,
                totalItem: totalItem.length
            })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    createColor: async (req, res) => {
        try {
            const { name, color } = req.body
            const colors = await colorModel.findOne({ name })
            if (colors) return res.status(400).json({ msg: "Màu này đã tồn tại" })
            const newColor = new colorModel({ name, color })
            await newColor.save()
            res.json({ msg: "Thêm mới thành công", newColor })

        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    deleteColors: async (req, res) => {
        try {
            const colors = await colorModel.findById(req.params.id)
            const products = await ProductsModel.find();

            const colorItem = colors.color.color
            const arrColor = []
            products.map((item, index) => {
                arrColor.push(item.colors.color)
            })
            const flat = [...new Set(flatArr(arrColor))]
            const isCheck = flat.includes(colorItem)
            if (isCheck) {
                return res.status(400).json({
                    msg: "Color đang tồn tại trong một sản phẩm"
                })
            }
            await colorModel.findByIdAndDelete(req.params.id)
            res.json({ msg: "Xóa thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },

    deleteAllColor: async (req, res) => {
        try {
            const rs = await colorModel.deleteMany({ _id: { $in: req.body.check } })
            res.json({ msg: "Xóa thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    upadateColors: async (req, res) => {
        try {
            const { name, color } = req.body
            await colorModel.findByIdAndUpdate({ _id: req.params.id }, { name, color })
            res.json({ msg: "Update thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    }
}

module.exports = colorCtrl