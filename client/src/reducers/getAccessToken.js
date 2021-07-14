import * as Type from "../contants/Actiontype"

const token = ''
const getToken = (state = token, action) => {
    switch (action.type) {
        case Type.GET_TOKEN_REQUEST:
            return state
        case Type.GET_TOKEN_SUCCESS:
            return action.payload
        case Type.CLEAR_TOKEN:
            return state = ''
        default:
            return state
    }
}
export default getToken