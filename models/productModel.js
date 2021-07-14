const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    images: {
        type: Array,
        default: [],
        required: true
    },
    comment: {
        type: String,
        // required: true
    },
    rating: {
        type: Number,
        default: 0,
        // required: true,
    },
}, {
    timestamps: true
})
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        // required: true
    },
    images: {
        type: Array,
        default: [],
        required: true
    },
    sizes: {
        type: Array,
        default: [],
        required: true
    },
    colors: {
        type: Array,
        default: [],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        trim: true,
        required: true
    },
    countInStock: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0,
        required: true,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0,
        required: true,
    },
    numberReview: {
        type: Number,
        default: 0,
        required: true,
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Products", productSchema)