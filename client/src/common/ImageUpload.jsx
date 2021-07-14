import { NotificationError } from "./Notification"
// import axios from "axios"

export const checkImage = (file) => {
    let err
    if (!file) {
        NotificationError("", "Chưa chọn file")
        err = "Chưa chọn file"
        // return;
    }
    if (file.size > 1024 * 1024) {
        NotificationError("", "Kích thước file quá lớn")
        err = "Kích thước file quá lớn"
        // return;
    }
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        NotificationError("", "File không đúng định dạng")
        err = "File không đúng định dạng"
        // return;
    }
    return err
}

export const ImageUpload = async (images) => {
    try {
        let imgArr = [];
        for (let item of images) {
            const formData = new FormData();
            formData.append("file", item)
            formData.append("upload_preset", "hydxyzsq")
            formData.append("cloud_name", "auth")
            // const res = await axios.post("https://api.cloudinary.com/v1_1/auth/image/upload",{formData})
            // console.log("res",res);
            const res = await fetch("https://api.cloudinary.com/v1_1/auth/image/upload", {
                method: "POST",
                body: formData
            })
            if (res?.status === 200) {
                const data = await res.json()
                imgArr.push({ public_id: data.public_id, url: data.secure_url })
            } else {
                NotificationError("", "Dung lượng ảnh vượt quá giới hạn vui lòng thử lại")
            }

        }
        return imgArr
    } catch (error) {

    }
}