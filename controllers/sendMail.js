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
                            <td style="padding:10px;text-align: left;">${item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>??</u></td>
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
                    <p>?????a ch???: ${data.address.recipient_name}, ${data.address.line1}, ${data.address.city},${data.address.state}</p>
                    `
                )
            } else {
                return (
                    `
                    <p> ?????a ch???: ${ data.address.delivery},${data.address.wards},${data.address.district} , ${data.address.province}
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
                    <p>X??c th???c email c???a b???n v???i StyleWay</p>
                    <a href=${url} style=" background: #000;display:inline-block; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0">${txt}</a>
                </div>
               
                `
                break;
            case "resetpass":
                html = `
                <div style=" padding:20px; ">
                        <img src="https://res.cloudinary.com/auth/image/upload/v1625409707/image/logo_seldmq.png" style="width:194px; height:39px"/>
                        <div>
                        <p>Vui l??ng x??c nh???n ?????i m???t kh???u</p>
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
                        <h2  style="margin:0; padding: 3px 0;">Ch??o m???ng b???n t???i v???i StyleWay:</h2>
                        <p style="margin:0; padding: 3px 0;">X??c nh???n ????n h??ng c???a b???n:</p>
                        <p style="margin:0">M?? ????n h??ng: #${data.paymentID}</p>
                        <p style="margin:0">Tr???ng th??i: <span style="color:green">${data.oderStatus}</span></p>
                        <p style="margin:0">Ph????ng th???c thanh to??n: ${data.paymentMethod}</p>
                        <p style="margin:0">S??? ??i???n tho???i: ${data.address.phone}</p>
                         ${addressCheck()} 
                        <p>Xin c???m ??n !</p>
                        <br/>
                        <table style="width:100% ; border-collapse:collapse;" border="1">
                            <tr>
                                <th style="padding:10px;text-align: left;">H??nh ???nh</th>
                                <th style="padding:10px;text-align: left;">T??n s???n ph???m</th>
                                <th style="padding:10px;text-align: left;">K??ch c???</th>
                                <th style="padding:10px;text-align: left;">M??u</th>
                                <th style="padding:10px;text-align: left;">S??? l?????ng</th>
                                <th style="padding:10px;text-align: left;">Gi??</th>
                            </tr>
                            ${cart}
                            <tr>
                                <th style="padding:10px;text-align: left;">T???ng ????n H??ng </th>
                                <th style="padding:10px;text-align: center;" colspan="5">${data.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>??</u></th>
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
                       <h2  style="margin:0; padding: 3px 0;">Ch??o m???ng b???n t???i v???i StyleWay:</h2>
                       <p style="margin:0; padding: 3px 0;">????n h??ng c???a b???n ???? ???????c x??c nh???n v?? trong qu?? tr??nh x??? l??:</p>
                       <p style="margin:0">M?? ????n h??ng: #${data.paymentID}</p>
                       <p style="margin:0">Tr???ng th??i: <span style="color:green">${data.oderStatus}</span></p>
                       <p style="margin:0">Ph????ng th???c thanh to??n: ${data.paymentMethod}</p>
                       <p style="margin:0">?????a ch???: ${data.address.line1 ? data.address.line1 : ""} ${data.address.city ? data.address.city : ""} ${data.address.state ? data.address.state : ""} ${data.address.delivery ? data.address.delivery : ""} ${data.address.wards ? data.address.wards : null} ${data.address.district ? data.address.district : ""} ${data.address.province ? data.address.province : ""} </p>
                       <h4>Xin c???m ??n !</h4>
                       <br/>
                       <table style="width:100% ; border-collapse:collapse;" border="1">
                           <tr>
                               <th style="padding:10px;text-align: left;">H??nh ???nh</th>
                               <th style="padding:10px;text-align: left;">T??n s???n ph???m</th>
                               <th style="padding:10px;text-align: left;">K??ch c???</th>
                               <th style="padding:10px;text-align: left;">M??u</th>
                               <th style="padding:10px;text-align: left;">S??? l?????ng</th>
                               <th style="padding:10px;text-align: left;">Gi??</th>
                           </tr>
                           ${cart}
                           <tr>
                               <th style="padding:10px;text-align: left;">T???ng ????n H??ng </th>
                               <th style="padding:10px;text-align: center;" colspan="5">${data.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>??</u></th>
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
                       <h2  style="margin:0; padding: 3px 0;">Ch??o m???ng b???n t???i v???i StyleWay:</h2>
                       <p style="margin:0; padding: 3px 0;">????n h??ng c???a b???n ???? b??? h???y v?? m???t s??? l?? do n??o ????:</p>
                       <p style="margin:0">M?? ????n h??ng: #${data.paymentID}</p>
                       <p style="margin:0">Tr???ng th??i: <span style="color:green">${data.oderStatus}</span></p>
                       <p style="margin:0">Ph????ng th???c thanh to??n: ${data.paymentMethod}</p>
                       ${addressCheck()}
                       <h4>Xin c???m ??n !</h4>
                       <br/>
                       <table style="width:100% ; border-collapse:collapse;" border="1">
                           <tr>
                               <th style="padding:10px;text-align: left;">H??nh ???nh</th>
                               <th style="padding:10px;text-align: left;">T??n s???n ph???m</th>
                               <th style="padding:10px;text-align: left;">K??ch c???</th>
                               <th style="padding:10px;text-align: left;">M??u</th>
                               <th style="padding:10px;text-align: left;">S??? l?????ng</th>
                               <th style="padding:10px;text-align: left;">Gi??</th>
                           </tr>
                           ${cart}
                           <tr>
                               <th style="padding:10px;text-align: left;">T???ng ????n H??ng </th>
                               <th style="padding:10px;text-align: center;" colspan="5">${data.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>??</u></th>
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