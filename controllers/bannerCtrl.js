const bannerModel = require('../models/bannerModel');

const bannerCtrl = {
    getBanners: async (req, res) => {
        try {

            const banner = await bannerModel.find()
            // const apiFeatures = new APIfeatures(colorModel.find(), req.query)
            //     .search()
            //     .sort()
            //     .pagination()

            // const colors = await apiFeatures.query
            // const totalItem = await colorModel.find()
            // res.json({
            //     colors,
            //     totalItem: totalItem.length
            // })
            res.json({
                banner
            })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    createBanner: async (req, res) => {
        try {
            const { public_id, url } = req.body
            const newBanner = new bannerModel({
                public_id, url
            })
            await newBanner.save()
            res.json({
                msg: "Thêm mới banner thành công"
            })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    deleteBanner: async (req, res) => {
        try {
            const { id } = req.params
            await bannerModel.findByIdAndDelete({ _id: id })
            res.json({ msg: "Xóa thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    }
}

module.exports = bannerCtrl