import http from "../api/http"
import * as Type from "../contants/Actiontype"
import { NotificationError, NotificationSuccess } from "../common/Notification";
import store from "../store"
import { ActGetUser } from "./auth";


export const addToCartUpdate = (type) => async (dispatch) => {
    try {

        const cartStore = store.getState().cart;
        const res = await http.post(`/addCart`, {
            cart: cartStore
        }).then((res) => {
            dispatch(ActGetUser()).then(res => {
                dispatch({ type: Type.REMOVE_LOADING })
            })
        })
        return res

    } catch (error) {
        console.log(error)
    }
}
export const addToCart = (product) => async (dispatch) => {
    // console.log("product", product)
    try {
        dispatch({
            type: Type.ADD_TO_CART,
            product
        })
        dispatch(addToCartUpdate())
        NotificationSuccess("", "Thêm sản phẩm thành công")
        // const cartStore = store.getState().cart;
        // const res = await http.post(`/addCart`, {
        //     cart: cartStore
        // }).then((res) => {
        //     dispatch(ActGetUser())
        //     NotificationSuccess("", "Thêm sản phẩm thành công")
        // })
    } catch (error) {
        console.log(error)
    }
}

export const getCart = (cart) => {
    return {
        type: Type.GET_CART,
        cart
    }
}

export const clearCart = () => {
    return {
        type: Type.CLEAR_CART,

    }
}

export const inCrement = (product) => async (dispatch) => {
    try {
        dispatch({ type: Type.SET_LOADING })
        dispatch({
            type: Type.INCREMENT,
            product
        })
        return dispatch(addToCartUpdate())

    } catch (error) {
        console.log(error)
    }
}
export const deCrement = (product) => async (dispatch) => {
    try {
        dispatch({ type: Type.SET_LOADING })
        dispatch({
            type: Type.DECREMENT,
            product
        })
        return dispatch(addToCartUpdate())
    } catch (error) {
        console.log(error)
    }
}

export const removeProduct = (product) => async (dispatch) => {
    try {
        dispatch({ type: Type.SET_LOADING })
        dispatch({
            type: Type.DELETE_PRODUCT,
            product
        })
        dispatch(addToCartUpdate())
    } catch (error) {
        console.log(error)
    }
}
export const removeAllProduct = (product) => async (dispatch) => {
    try {
        const msgRemove = "Xóa sản phẩm thành công"
        const msgPay = "Đặt hàng thành công"
        dispatch({ type: Type.SET_LOADING })
        dispatch({
            type: Type.DELETE_ALL_PRODUCT,
            product
        })
        dispatch(addToCartUpdate())
        return { msgRemove, msgPay }
    } catch (error) {
        console.log(error)
        NotificationError("", "Đã gặp lỗi gì đó vui lòng thử lại")
    }
}





