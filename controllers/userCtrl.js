const Users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');

const { CLIENT_URL } = process.env;

const { google } = require('googleapis');
const fetch = require('node-fetch');
const { OAuth2 } = google.auth;
const client = new OAuth2(process.env.MAILLING_SERVICE_CLIENT_ID)
const APIfeatures = require('../utils/APIfeatures');


const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ msg: "Vui lòng nhập đầy đủ các trường" })
            }
            if (!validateEmail(email)) {
                return res.status(400).json({ msg: "Email không đúng định dạng " })
            }
            const user = await Users.findOne({ email })
            if (user) {
                return res.status(400).json({ msg: "Email đã tồn tại " })
            }
            if (password.length < 6) {
                return res.status(400).json({ msg: "Password ít nhất 6 ký tự " })
            }
            const passwordHash = await bcrypt.hash(password, 12)
            const newUser = {
                name, email, password: passwordHash
            }
            const activation_token = createActivationToken(newUser)
            const url = `${CLIENT_URL}/user/activate/${activation_token}`
            sendMail(email, url, "Xác thực email của bạn", "verify")
            res.json({ msg: "Đăng ký thành công. Vui lòng kiểm tra Email" })
        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body;
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)
            const { name, email, password } = user;
            const check = await Users.findOne({ email })
            if (check) return res.status(400).json({ msg: "Email đã được đăng ký" });
            const newUser = new Users({
                name, email, password
            })
            await newUser.save()
            res.json({ msg: "Tài khoản của bạn đã được kích hoạt" })
        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "Email không tồn tại" })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Mật khẩu không chính xác" })

            const refresh_token = createRefreshToken({ id: user._id })
            // console.log("refresh_token", refresh_token)
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            res.json({
                msg: "Đăng nhập thành công ",
                refresh_token
            })
        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    logout: (req, res) => {
        try {
            res.clearCookie("refreshtoken", {
                path: "/user/refresh_token",
            })

            return res.json({ msg: "Đăng xuất thành công" })
        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    //  xử lý refresh token
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            // console.log("rf_token", rf_token)
            if (!rf_token) return res.status(400).json({ msg: "Vui lòng đăng nhập" });
            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Vui lòng đăng nhập" });
                const access_token = createAccessToken({ id: user.id })
                res.json({ access_token })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "Email này không tồn tại" })
            const access_token = createAccessToken({ id: user._id })
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            sendMail(email, url, "Xác nhận đổi mật khẩu", "resetpass");
            res.json({ msg: "Vui lòng xác nhận email" })

        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password } = req.body;
            const passwordHash = await bcrypt.hash(password, 12);
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })
            res.json({ msg: 'Đổi mật khẩu thành công' })

        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    changePassword: async (req, res) => {
        try {
            const { cr_password, new_password } = req.body;
            const user = await Users.findById(req.user.id)
            const isMatch = await bcrypt.compare(cr_password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password hiện tại không chính xác" })

            const passwordHash = await bcrypt.hash(new_password, 12);
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })
            res.json({ msg: 'Đổi mật khẩu thành công' })

        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    addUser: async (req, res) => {
        try {
            const { name, email, role, password } = req.body;

            const ischeck = await Users.findOne({ email })
            if (ischeck) return res.status(400).json({ msg: "Email đã tồn tại" })

            const hashPassword = await bcrypt.hash(password, 12)
            const user = new Users({
                name,
                email,
                password: hashPassword,
                role: role === "" ? 0 : role
            })
            await user.save()
            res.json({ msg: "Thêm mới người dùng thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    getUserInfo: async (req, res) => {
        try {

            const user = await Users.findById(req.user.id).select("-password")
                .populate({
                    path: 'wishlist',
                    // select: 'name avatar'
                })
            res.json(user)
            // console.log(user);

        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    getAllUser: async (req, res) => {
        try {
            const apiFeatures = new APIfeatures(Users.find(), req.query)
                .search()
                .sort()
                .pagination()

            const user = await apiFeatures.query
            const totalItem = await Users.find()
            res.json({
                user,
                totalItem: totalItem.length
            })
            // res.json(user)
        } catch (err) {
            res.status(500).json({ msg: err.messages })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { name, avatar, address, phone, gender, birthday } = req.body
            const user = await Users.findOneAndUpdate({ _id: req.user.id }, {
                name, avatar, address, phone, gender, birthday
            })
            res.json({ msg: "Cập nhật thành công" })
        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    updateRole: async (req, res) => {
        try {
            const { role } = req.body
            const { id } = req.params;
            const user = await Users.findOneAndUpdate({ _id: req.params.id }, {
                role
            })
            res.json({ msg: "Cập nhật Role Thành công" })
        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            await Users.findByIdAndDelete({ _id: id })
            res.json({ msg: "Xóa thành công" })
        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    deleteUserAll: async (req, res) => {
        try {
            const { check } = req.body
            const user = await Users.deleteMany({ _id: { $in: req.body.check } })
            res.json({ msg: "Xóa thành công" })

        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    addCart: async (req, res) => {
        try {

            const user = await Users.findById(req.user.id)
            if (!user) return res.status(400).json({ msg: "Tài khoản này không tồn tại" })

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cart: req.body.cart
            })
            res.json({ msg: "Success" })

        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    addWishlist: async (req, res) => {
        try {
            const user = await Users.find({
                _id: req.user.id,
                wishlist: req.body.productID
            })
            if (user.length > 0) return res.status(400).json({ msg: 'Sản phẩm này đã có trong danh sách yêu thích của bạn' })
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                $push: {
                    wishlist: req.body.productID
                }
            }, { new: true })
            res.json({ msg: "Thêm thành công" })

        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },
    removeWishList: async (req, res) => {
        try {
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                $pull: {
                    wishlist: req.body.productID
                }
            }, { new: true })
            res.json({ msg: "Xóa thành công" })
        } catch (error) {
            return res.status(500).json({ msg: error.messages })
        }
    },



    googleLogin: async (req, res) => {
        try {
            const { tokenId } = req.body;
            const verify = await client.verifyIdToken({ idToken: tokenId, audience: process.env.MAILLING_SERVICE_CLIENT_ID })
            const { email_verified, email, picture, name } = verify.payload
            const password = email + process.env.GOOGLE_SECRET
            const passwordHash = await bcrypt.hash(password, 12)
            if (!email_verified) return res.json(400).json({ msg: "Email xác minh không chính xác" })

            const user = await Users.findOne({ email })
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) return res.status(400).json({ msg: "Mật khẩu không chính xác" })
                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                res.json({ msg: "Đăng nhập thành công", refresh_token })
            }
            else {
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture
                })
                await newUser.save()
                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                res.json({ msg: "Đăng nhập thành công", refresh_token })
            }

        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    },
    facebookLogin: async (req, res) => {
        try {
            const { userID, accessToken } = req.body;

            let URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`
            const data = await fetch(URL).then(res => res.json()).then(res => { return res })
            const { email, picture, name } = data
            const password = email + process.env.FACEBOOK_SECRET
            const passwordHash = await bcrypt.hash(password, 12)

            const user = await Users.findOne({ email })
            if (user) {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) return res.status(400).json({ msg: "Mật khẩu không chính xác" })
                const refresh_token = createRefreshToken({ id: user._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                res.json({ msg: "Đăng nhập thành công", refresh_token })
            }
            else {
                const newUser = new Users({
                    name, email, password: passwordHash, avatar: picture.data.url
                })
                await newUser.save()
                const refresh_token = createRefreshToken({ id: newUser._id })
                res.cookie('refreshtoken', refresh_token, {
                    httpOnly: true,
                    path: '/user/refresh_token',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                res.json({ msg: "Đăng nhập thành công", refresh_token })
            }

        } catch (err) {
            return res.status(500).json({ msg: err.messages })
        }
    }
}
// return res.status(500).json({ msg: err.messages })
const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: "1m" })
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
module.exports = userCtrl