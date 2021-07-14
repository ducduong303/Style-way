import http from "../api/http"
import * as Type from "../contants/Actiontype"
import { NotificationError, NotificationSuccess } from "../common/Notification";
import axios from "axios";
// import { history } from "../common/history"
import { ImageUpload } from "../common/ImageUpload";
// import { getCart } from "./cart";


export const ActLogin = (user) => async (dispatch) => {
    try {

        dispatch({ type: Type.LOGIN_REQUEST })

        const res = await axios.post("/user/login", {
            email: user.email,
            password: user.password
        })
        if (res?.status === 200) {
            dispatch({
                type: Type.LOGIN_SUCCESS,
            })
            // console.log("reslogin",res)
            localStorage.setItem("isLogin", true)
            NotificationSuccess("", res.data.msg)
            // dispatch({ type: Type.REMOVE_LOADING })
        }
    } catch (err) {
        dispatch({
            type: Type.LOGIN_ERR,
        })
        NotificationError("", err?.response?.data.msg)
    }
}


export const ActRegister = (user) => async (dispatch) => {
    try {
        dispatch({ type: Type.REGISTER_REQUEST })
        const res = await http.post("/register", {
            ...user
        })
        if (res?.status === 200) {
            dispatch({
                type: Type.REGISTER_SUCCESS,
            })
            NotificationSuccess("", res.data.msg)

        }
        return res
    } catch (err) {
        dispatch({
            type: Type.REGISTER_ERR,
        })
        NotificationError("", err.msg)
    }
}

export const ActGettoken = () => async (dispatch) => {
    try {
        dispatch({ type: Type.GET_TOKEN_REQUEST })

        const res = await axios.get("/user/refresh_token", {
            withCredentials: true,
        })

        // const refresh_token = localStorage.getItem("refresh_token")
        // const res = await http.post("/refresh_token", { refresh_token })

        if (res?.status === 200) {
            dispatch({
                type: Type.GET_TOKEN_SUCCESS,
                payload: res.data.access_token
            })
            // dispatch({
            //     type: Type.LOGIN_SUCCESS,
            // })
            // dispatch(ActGetUser())
            localStorage.setItem("access_token", res.data.access_token)
        }
    } catch (err) {
        dispatch({
            type: Type.GET_TOKEN_ERR,
        })
    }
}

export const ActGetUser = () => async (dispatch) => {
    try {
        dispatch({ type: Type.GET_USER_REQUEST })
        const res = await http.get("/info")
        if (res?.status === 200) {
            dispatch({
                type: Type.GET_USER_SUCCESS,
                payload: {
                    user: res.data,
                    isAdmin: res.data.role === 1 ? true : false
                }
            })
            dispatch({
                type: Type.GET_CART,
                cart: res.data.cart
            })

            // dispatch(getCart(res.data.cart))
        }
    } catch (err) {
        dispatch({
            type: Type.GET_TOKEN_ERR,
        })
    }
}

export const ActLogOut = () => async (dispatch) => {
    try {
        dispatch({ type: Type.LOGOUT_REQUEST })
        const res = await http.get("/logout")
        if (res?.status === 200) {
            dispatch({
                type: Type.LOGOUT_SUCCESS,
            })
            localStorage.clear()
            dispatch(ActClearToken())
        }
    } catch (err) {
        dispatch({
            type: Type.GET_TOKEN_ERR,
        })
    }
}

export const ActClearToken = () => async (dispatch) => {
    dispatch({ type: Type.CLEAR_TOKEN })
}

export const ActForgotPassword = (email) => async (dispatch) => {
    dispatch({ type: Type.FORGOT_REQUEST })
    try {
        const res = await http.post("/forgot_password", { email: email })
        NotificationSuccess("", res.data.msg)
    } catch (err) {
        NotificationError("", err.msg)
    }
}

export const ActResetPassword = (password, token) => async (dispatch) => {
    dispatch({ type: Type.RESET_PASSWORD_REQUEST })
    try {
        const res = await axios.post("/user/reset_password", { password: password }, {
            headers: { Authorization: token }
        })
        if (res.status === 200) {
            NotificationSuccess("", res.data.msg)
        }
    } catch (err) {
        // NotificationError("", err.msg)
        console.log(err);
    }
}

export const ActUpdateInfo = (data) => async (dispatch) => {
    try {
        const { name, avatar, address, birthday, gender, phone } = data.userValue
        dispatch({ type: Type.SET_LOADING })
        dispatch({ type: Type.UPDATE_INFO })
        if (typeof avatar === "string") {
            const res = await http.post("/update_user", {
                name: name,
                avatar: avatar,
                address, birthday, gender, phone
            })
            if (res?.status === 200) {
                dispatch(ActGetUser())
                NotificationSuccess("", res.data.msg)
            }
            dispatch({ type: Type.REMOVE_LOADING })
            return res
        } else {
            let media = await ImageUpload([avatar]);
            const res = await http.post("/update_user", {
                name: name,
                avatar: media[0].url,
                address, birthday, gender, phone
            })
            if (res?.status === 200) {
                dispatch(ActGetUser())
                NotificationSuccess("", res.data.msg)
            }
            dispatch({ type: Type.REMOVE_LOADING })
            return res
        }
    } catch (err) {
        console.log(err);

    }
}


