import * as Type from "../contants/Actiontype"

const initialState = {
    user: [],
    isLogger: false,
    isAdmin: false,
}
const auth = (state = initialState, action) => {
    switch (action.type) {
        case Type.LOGIN_REQUEST:
            return {
                ...state
            }
        case Type.LOGIN_SUCCESS:
            return {
                ...state,
                isLogger: true,
            }
        case Type.LOGIN_ERR:
            return {
                ...state,
            }
        case Type.GET_USER_REQUEST:
            return {
                ...state,
            }
        case Type.GET_USER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAdmin: action.payload.isAdmin
            }
        case Type.LOGOUT_SUCCESS:
            return {
                user: [],
                isLogger: false,
                isAdmin: false,
            }
        default:
            return state
    }
}
export default auth