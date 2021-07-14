const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter your name"],
        trim: true
    },
    email: {
        type: String,
        require: [true, "Please enter your email"],
        trim: true,
        unique: true
    },
    phone: {
        type: String,
        default: null
    },
    gender: {
        type: String,
        default: null
    },
    birthday: {
        type: String,
        default: null
    },
    address: {
        type: Array,
        default: []
    },
    password: {
        type: String,
        require: [true, "Please enter your password"],
    },
    role: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/auth/image/upload/v1621558733/user_irby5l.png"
    },
    cart: {
        type: Array,
        default: []
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Products",
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model("User", userSchema)