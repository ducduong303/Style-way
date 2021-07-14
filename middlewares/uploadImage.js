const fs = require('fs');

module.exports = async function (req, res, next) {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: "Không có file Upload" })
        const file = req.files.file;
        // console.log(file);

        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Kích thước file quá lớn" })
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "File không đúng định dạng" })
        }
        next()

    } catch (err) {
        return res.status(500).json({ msg: err.messages })
    }
}

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) {
            return err
        }
    })
}