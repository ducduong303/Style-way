import * as Type from "../contants/Actiontype"
const initialState = {
    isShowDrawer: false,

}
const products = (state = initialState, action) => {
    switch (action.type) {
        case Type.SHOW_DRAWER:
            return {
                ...state,
                isShowDrawer: true
            }
        case Type.HIDE_DRAWER:
            return {
                ...state,
                isShowDrawer: false
            }
        default:
            return state
    }
}
export default products