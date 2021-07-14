const Users = require('../models/userModel');

const authAdmin = async (req, res, next) => {
    try {
        const user = await Users.findOne({ _id: req.user.id })
        if (user.role !== 1)
            return res.status(500).json({ msg: "Cần quyền truy cập của admin" })
        next()

    } catch (err) {
        return res.status(500).json({ msg: err.messages })
    }
}

module.exports = authAdmin