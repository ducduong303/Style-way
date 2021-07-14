const oderModel = require('..//models/oderModel');
const ProductsModel = require('../models/productModel');
const Users = require('../models/userModel');
const sendMail = require('./sendMail');
const APIfeatures = require('../utils/APIfeatures');

const oderCtrl = {
    deleteAllOder: async (req, res) => {
        try {
            const rs = await oderModel.deleteMany({ _id: { $in: req.body.check } })
            res.json({ msg: "Xóa thành công" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getAllOder: async (req, res) => {
        try {
            const apiFeatures = new APIfeatures(oderModel.find(), req.query)
                .search()
                .filter()
                .sort()
                .searchOder()
                .oderStatus()
                .payStatus()
                .pagination()
            const oders = await apiFeatures.query
            const totalItem = await oderModel.find()
            res.json({
                oders,
                totalItem: totalItem.length
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createOder: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select("name email")
            if (!user) return res.status(400).json({ msg: "Tài khoản không tồn tại" })
            const { cart, address, paymentID, paymentMethod, totalPrice, isPaid } = req.body.oderNew;
            const { _id, name, email } = user
            const newOder = new oderModel({
                user_id: _id,
                name, email,
                cart,
                address,
                userOder: _id,
                isPaid,
                paymentID,
                paymentMethod,
                totalPrice,
            })
            // console.log(newOder)
            // // cart.filter(item => {
            // //     return productSold(item.id, item.count, item.sold, item.countInStock)
            // // })
            sendMail(email, "xxxx", "Xác nhận đơn hàng", "oder-new", newOder)
            await newOder.save()
            res.json(newOder)
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    getHistoryOder: async (req, res) => {
        try {
            const apiFeatures = new APIfeatures(oderModel.find({ user_id: req.user.id }), req.query)
                .search()
                .filter()
                .sort()
                .searchOder()
                .oderStatus()
                .payStatus()
                .pagination()
            const oders = await apiFeatures.query
            const totalItem = await oderModel.find({ user_id: req.user.id })
            res.json({
                oders,
                totalItem: totalItem.length
            })
            // const history = await oderModel.find({ user_id: req.user.id })
            // res.json(history)
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    getOderDetail: async (req, res) => {
        try {
            const { id } = req.params;
            const oder = await oderModel.findById(id)
            res.json(oder)
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    updateOder: async (req, res) => {
        try {
            const { id } = req.params;
            // console.log(id)
            const oder = await oderModel.findById(id)
            if (oder.oderStatus === "Đã giao hàng") {
                return res.status(400).json({ msg: "Sản phẩm đã được giao hàng" })
            }
            // console.log(oder.email)
            oder.oderStatus = req.body.status
            if (req.body.status === "Đã xác nhận") {
                oder.cart.filter(item => {
                    return productSold(item.id, item.count, item.sold, item.countInStock)
                })

               sendMail(oder.email, "xxxx", "Đơn hàng của bạn đã được xác nhận", "confirm-oder", oder)
            } else {
               sendMail(oder.email, "xxxx", "Đơn hàng của bạn đã đã bị hủy", "destroy-oder", oder)
            }
            await oder.save();
            res.json(oder)
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    useDestroyOder: async (req, res) => {
        try {
            const { id } = req.params;
            const oder = await oderModel.findById(id)
            oder.oderStatus = req.body.status
            await oder.save();
            res.json({ msg: "Hủy thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    deleteOder: async (req, res) => {
        try {
            const { id } = req.params;
            await oderModel.findByIdAndDelete({ _id: id })
            res.json({ msg: "Xóa thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    qeOderRemove: async (req, res) => {
        try {
            res.json("thành công")
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    }
}
const productSold = async (id, count, oldSold, countInStock) => {
    await ProductsModel.findOneAndUpdate({ _id: id }, {
        sold: count + oldSold,
        countInStock: countInStock > 0 ? countInStock - count : 0
    })
}

module.exports = oderCtrl