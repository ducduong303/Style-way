const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    hastag: {
        type: String,
        require: true,
    },
    images: {
        type: Array,
        default: [],
        required: true
    },
    desc: {
        type: String,
        require: true,
    },
    like: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "User",
            },
        }
    ]

}, {
    timestamps: true
})

module.exports = mongoose.model("Blog", blogSchema)