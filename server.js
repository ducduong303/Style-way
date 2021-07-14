require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
var cookieParser = require('cookie-parser')
const userRouter = require('./routes/userRouter')
const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use("/users", userRouter)
const path = require('path')

// Router
// app.use("/user", require('./routes/userRouter'))
// app.use("/user/image", require('./routes/upload'))
// app.use("/user/category", require('./routes/categoryRouter'))
// app.use("/user/size", require('./routes/sizeRouter'))
// app.use("/user/color", require('./routes/colorRouter'))
// app.use("/user/products", require('./routes/productRouter'))
// app.use("/user/oder", require('./routes/oderRouter'))
// app.use("/user/banner", require('./routes/bannerRouter'))
// app.use("/user/blog", require('./routes/blogRouter'))



// Connect to MongoDB
const URI = process.env.MONGOODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) return err;
    console.log('Connected to MongoDB')
})

// Below MongoDB and  Above Listen Sever
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    });
}

// Listen Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})