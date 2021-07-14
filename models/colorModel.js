const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    color: {
        type: String,
        require: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Colors", colorSchema)