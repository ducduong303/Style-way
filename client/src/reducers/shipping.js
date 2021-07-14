import * as Type from "../contants/Actiontype"
const initialState = {
    isShipping: false,
    oder: []
}
const products = (state = initialState, action) => {
    switch (action.type) {
        case Type.SHIPPING:
            return {
                ...state,
                isShipping: true
            }
        case Type.ODER:
            // console.log(aciton)
            return state
        default:
            return state
    }
}
export default products