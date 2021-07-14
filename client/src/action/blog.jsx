// import * as Type from "../contants/Actiontype"
import { NotificationError } from "../common/Notification"
import { ImageUpload } from "../common/ImageUpload"
import http from "../api/http"


export const ActCreateBlog = ({ images, desc, hastag }) => async (dispatch) => {
    // console.log({ title, images, category, description, sizes });
    let media = []
    try {
        if (images.length > 0) media = await ImageUpload(images)
        const res = await http.post("/blog", {
            images: media, desc, hastag
        })
        return res
    } catch (err) {
        NotificationError("", err.msg)
    }
}


export const ActUpdateBlog = ({ images, blogEdit, desc, hastag }) => async (dispatch) => {
    let media = []
    const imgNewImg = images.filter(img => !img.url)
    const imgOldImg = images.filter(img => img.url)

    if (imgNewImg.length === 0
        && imgOldImg.length === blogEdit.images.length
        && blogEdit.desc === desc && blogEdit.hastag === hastag
    ) {
        return;
    }
    try {

        if (imgNewImg.length > 0) {
            media = await ImageUpload(imgNewImg)
        }
        const res = await http.put(`blog/${blogEdit._id}`, {
            images: [...imgOldImg, ...media], desc, hastag
        })
        return res;

    } catch (error) {
        NotificationError("", error.msg)
    }
}