import * as Type from "../contants/Actiontype"
import { NotificationError } from "../common/Notification"
import { ImageUpload } from "../common/ImageUpload"
import http from "../api/http"
// import { history } from "../common/history";
export const ActCreateProduct = ({ name, images, category, description, sizes, price, colors, countInStock }) => async (dispatch) => {
    // console.log({ title, images, category, description, sizes });
    let media = []
    try {
        // dispatch({ type: Type.SET_LOADING })
        if (images.length > 0) media = await ImageUpload(images)
        const res = await http.post("/products", {
            name, images: media, category, description, sizes, price, colors, countInStock
        })
        return res
    } catch (err) {
        NotificationError("", err.msg)
    }
}
export const ActUpdateProduct = ({ name, images, productEdit, category, description, sizes, price, colors, countInStock }) => async (dispatch) => {
    let media = []
    const imgNewImg = images.filter(img => !img.url)
    const imgOldImg = images.filter(img => img.url)

    const sizeNew = sizes.filter(size => !size)
    const sizeOld = sizes.filter(size => size)

    const colorNew = colors.filter(color => !color)
    const colorOld = colors.filter(color => color)
    // console.log({ productEdit, colors })
    // console.log({ colorNew, colorOld })
    if (productEdit.name === name && imgNewImg.length === 0
        && imgOldImg.length === productEdit.images.length
        && productEdit.category === category && productEdit.description === description
        && sizeNew.length === 0 && sizeOld.length === productEdit.sizes.length &&
        productEdit.countInStock === countInStock && productEdit.price === price
        && colorNew.length === 0 && colorOld.length === productEdit.colors.length
    ) {
        // history.goBack();
        return;
    }
    try {
        // dispatch({ type: Type.SET_LOADING })
        if (imgNewImg.length > 0) {
            media = await ImageUpload(imgNewImg)
        }
        const res = await http.post(`products/${productEdit._id}`, {
            name, images: [...imgOldImg, ...media], category, description, sizes, price, colors, countInStock
        })
        return res;

    } catch (error) {
        NotificationError("", error.msg)
    }
}

export const ActChangePage = (page) => {
    return {
        type: Type.CHANGEPAGE,
        page,
    }
}

