const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    // images: {
    //     type: Array,
    //     default: [],
    //     required: true
    // },
    public_id: {
        type: String,
        require: true,
    },
    url: {
        type: String,
        require: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Banners", bannerSchema)