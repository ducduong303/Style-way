const mongoose = require('mongoose');

const oderSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        type: Array,
        default: []
    },
    paymentID: {
        type: String,
        required: true,
    },
    userOder: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    oderStatus: {
        type: String,
        required: true,
        default: "Đang chờ xử lý"
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    // paidAt: {
    //     type: Date
    // },
}, {
    timestamps: true
})

module.exports = mongoose.model("Oder", oderSchema)