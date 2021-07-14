const cloudinary = require('cloudinary')
const fs = require('fs')

// Config cloud
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

const uploadCtrl = {
    uploadImage: (req, res) => {
        try {
            const file = req.files.file;
            cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'image'
            }, async (err, result) => {
                // if (err) throw err;
                if (err) return err;
                removeTmp(file.tempFilePath)
                res.json({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    deleteImage: (req, res) => {
        try {
            const { public_id } = req.body;
            // console.log(public_id)
            if (!public_id) return res.status(400).json({ msg: "Chưa chọn file để xóa" })
            cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
                // if (err) throw err;
                if (err) return err;
                res.json({ msg: "Xóa ảnh thành công" })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) {
            return err
        }
    })
}

module.exports = uploadCtrl