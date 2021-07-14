const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";


const {
    MAILLING_SERVICE_CLIENT_ID,
    MAILLING_SERVICE_CLIENT_SECRET,
    MAILLING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env

const oauth2Client = new OAuth2(
    MAILLING_SERVICE_CLIENT_ID,
    MAILLING_SERVICE_CLIENT_SECRET,
    MAILLING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)

// Send Mail
const sendEmail = (to, url, txt, type, data) => {
    // console.log({ to, url, txt, type, data })
    oauth2Client.setCredentials({
        refresh_token: MAILLING_SERVICE_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken();
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILLING_SERVICE_CLIENT_ID,
            clientSecret: MAILLING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILLING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    })


    const renderHTML = (to, url, txt, type, data) => {

        if (type === "oder-new" || type === "confirm-oder" || type === "destroy-oder") {
            var cart = data.cart.map((item, index) => {
                return (
                    `
                        <tr>
                            <td style="padding:10px;text-align: left;"><img src=${item.image} style="width:70px;height:80px" alt=""></td>
                            <td style="padding:10px;text-align: left;">${item.name}</td>
                            <td style="padding:10px;text-align: left;">${item.size ? item.size : ""}</td>
                            <td style="padding:10px;text-align: left;">${item.color ? item.color.name : ""}</td>
                            <td style="padding:10px;text-align: left;">${item.count}</td>
                            <td style="padding:10px;text-align: left;">${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>đ</u></td>
                        </tr>
                    `
                )
            })
        }

        // let addressCheck = data.paymentMethod === "Paypal" ? (data.address.recipient_name, data.address.line1, data.address.city, data.address.state) : (data.address.delivery, data.address.wards, data.address.district, data.address.province)
        const addressCheck = () => {
            if (data.paymentMethod === "Paypal") {
                return (
                    `
                    <p>Địa chỉ: ${data.address.recipient_name}, ${data.address.line1}, ${data.address.city},${data.address.state}</p>
                    `
                )
            } else {
                return (
                    `
                    <p> Địa chỉ: ${ data.address.delivery},${data.address.wards},${data.address.district} , ${data.address.province}
                   }</p>
                    `
                )
            }
        }
        let html;
        switch (type) {
            case "verify":
                html = `

                <div style=" padding:20px; ">
                    <img src="https://res.cloudinary.com/auth/image/upload/v1625409707/image/logo_seldmq.png" style="width:194px; height:39px"/>
                    <p>Xác thực email của bạn với StyleWay</p>
                    <a href=${url} style=" background: #000;display:inline-block; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0">${txt}</a>
                </div>
               
                `
                break;
            case "resetpass":
                html = `
                <div style=" padding:20px; ">
                        <img src="https://res.cloudinary.com/auth/image/upload/v1625409707/image/logo_seldmq.png" style="width:194px; height:39px"/>
                        <div>
                        <p>Vui lòng xác nhận đổi mật khẩu</p>
                        <a href=${url} style=" background: #000;display:inline-block; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0">${txt}</a>
                        </div>
                </div>
                `
                break;
            case "oder-new":
                html = `
                 <div  style="border: 1px solid #ccc; border-radius:5px; padding:10px 5px;">
                    <div style="padding:5px 0px">
                        <img src="https://res.cloudinary.com/auth/image/upload/v1625409707/image/logo_seldmq.png" alt="" style="width:194px; height:39px"/>
                        <h2  style="margin:0; padding: 3px 0;">Chào mừng bạn tới với StyleWay:</h2>
                        <p style="margin:0; padding: 3px 0;">Xác nhận đơn hàng của bạn:</p>
                        <p style="margin:0">Mã đơn hàng: #${data.paymentID}</p>
                        <p style="margin:0">Trạng thái: <span style="color:green">${data.oderStatus}</span></p>
                        <p style="margin:0">Phương thức thanh toán: ${data.paymentMethod}</p>
                        <p style="margin:0">Số điện thoại: ${data.address.phone}</p>
                         ${addressCheck()} 
                        <p>Xin cảm ơn !</p>
                        <br/>
                        <table style="width:100% ; border-collapse:collapse;" border="1">
                            <tr>
                                <th style="padding:10px;text-align: left;">Hình ảnh</th>
                                <th style="padding:10px;text-align: left;">Tên sản phẩm</th>
                                <th style="padding:10px;text-align: left;">Kích cỡ</th>
                                <th style="padding:10px;text-align: left;">Màu</th>
                                <th style="padding:10px;text-align: left;">Số lượng</th>
                                <th style="padding:10px;text-align: left;">Giá</th>
                            </tr>
                            ${cart}
                            <tr>
                                <th style="padding:10px;text-align: left;">Tổng Đơn Hàng </th>
                                <th style="padding:10px;text-align: center;" colspan="5">${data.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>đ</u></th>
                             </tr>
                        </table>
                        
                    </div>
                </div>
                `
                break;
            case "confirm-oder":
                html = `
                <div  style="border: 1px solid #ccc; border-radius:5px; padding:10px 5px;">
                   <div style="padding:5px 5px">
                       <img src="https://res.cloudinary.com/auth/image/upload/v1625409707/image/logo_seldmq.png" style="width:194px; height:39px"/>
                       <h2  style="margin:0; padding: 3px 0;">Chào mừng bạn tới với StyleWay:</h2>
                       <p style="margin:0; padding: 3px 0;">Đơn hàng của bạn đã được xác nhận và trong quá trình xử lý:</p>
                       <p style="margin:0">Mã đơn hàng: #${data.paymentID}</p>
                       <p style="margin:0">Trạng thái: <span style="color:green">${data.oderStatus}</span></p>
                       <p style="margin:0">Phương thức thanh toán: ${data.paymentMethod}</p>
                       <p style="margin:0">Địa chỉ: ${data.address.line1 ? data.address.line1 : ""} ${data.address.city ? data.address.city : ""} ${data.address.state ? data.address.state : ""} ${data.address.delivery ? data.address.delivery : ""} ${data.address.wards ? data.address.wards : null} ${data.address.district ? data.address.district : ""} ${data.address.province ? data.address.province : ""} </p>
                       <h4>Xin cảm ơn !</h4>
                       <br/>
                       <table style="width:100% ; border-collapse:collapse;" border="1">
                           <tr>
                               <th style="padding:10px;text-align: left;">Hình ảnh</th>
                               <th style="padding:10px;text-align: left;">Tên sản phẩm</th>
                               <th style="padding:10px;text-align: left;">Kích cỡ</th>
                               <th style="padding:10px;text-align: left;">Màu</th>
                               <th style="padding:10px;text-align: left;">Số lượng</th>
                               <th style="padding:10px;text-align: left;">Giá</th>
                           </tr>
                           ${cart}
                           <tr>
                               <th style="padding:10px;text-align: left;">Tổng Đơn Hàng </th>
                               <th style="padding:10px;text-align: center;" colspan="5">${data.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>đ</u></th>
                            </tr>
                       </table>
                       
                   </div>
               </div>
               `
                break;
            case "destroy-oder":
                html = `
                <div  style="border: 1px solid #ccc; border-radius:5px; padding:10px 5px;">
                   <div style="padding:5px 0px">
                       <img src="https://res.cloudinary.com/auth/image/upload/v1625409707/image/logo_seldmq.png" style="width:194px; height:39px"/>
                       <h2  style="margin:0; padding: 3px 0;">Chào mừng bạn tới với StyleWay:</h2>
                       <p style="margin:0; padding: 3px 0;">Đơn hàng của bạn đã bị hủy vì một số lý do nào đó:</p>
                       <p style="margin:0">Mã đơn hàng: #${data.paymentID}</p>
                       <p style="margin:0">Trạng thái: <span style="color:green">${data.oderStatus}</span></p>
                       <p style="margin:0">Phương thức thanh toán: ${data.paymentMethod}</p>
                       ${addressCheck()}
                       <h4>Xin cảm ơn !</h4>
                       <br/>
                       <table style="width:100% ; border-collapse:collapse;" border="1">
                           <tr>
                               <th style="padding:10px;text-align: left;">Hình ảnh</th>
                               <th style="padding:10px;text-align: left;">Tên sản phẩm</th>
                               <th style="padding:10px;text-align: left;">Kích cỡ</th>
                               <th style="padding:10px;text-align: left;">Màu</th>
                               <th style="padding:10px;text-align: left;">Số lượng</th>
                               <th style="padding:10px;text-align: left;">Giá</th>
                           </tr>
                           ${cart}
                           <tr>
                               <th style="padding:10px;text-align: left;">Tổng Đơn Hàng </th>
                               <th style="padding:10px;text-align: center;" colspan="5">${data.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>đ</u></th>
                            </tr>
                       </table>
                   </div>
               </div>
               `
                break;
            default:
                return html
        }
        return html
    }
    const mailOption = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: `StyleWay: ${txt}`,
        html: renderHTML(to, url, txt, type, data)
        // html:  `
    }


    smtpTransport.sendMail(mailOption, (err, info) => {
        if (err) {
            console.log(err);
            return err;
        }
        return info
    })
}


module.exports = sendEmail