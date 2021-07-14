
const blogModel = require('../models/blogModel');
const APIfeatures = require('../utils/APIfeatures');

const blogCtrl = {
    getBlogs: async (req, res) => {
        try {
            const apiFeatures = new APIfeatures(blogModel.find(), req.query)
                .search()
                .sort()
                .pagination()
            const blogs = await apiFeatures.query
            const totalItem = await blogModel.find()
            res.json({
                blogs,
                totalItem: totalItem.length
            })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    createBlog: async (req, res) => {
        try {

            const { hastag, images, desc, } = req.body
            const newBlog = new blogModel({
                hastag, images, desc
            })
            await newBlog.save()
            res.json({
                msg: "Thêm mới bài viết thành công",
                newBlog
            })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    getDetailBlog: async (req, res) => {
        try {
            const { id } = req.params;
            const blog = await blogModel.findById(id)
            res.json(blog)
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    updateBlog: async (req, res) => {
        try {
            const { hastag, images, desc } = req.body
            await blogModel.findByIdAndUpdate({ _id: req.params.id }, { hastag, images, desc })
            res.json({ msg: "Update thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    deleteBlog: async (req, res) => {
        try {
            const { id } = req.params
            await blogModel.findByIdAndDelete({ _id: id })
            res.json({ msg: "Xóa thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },


}

module.exports = blogCtrl