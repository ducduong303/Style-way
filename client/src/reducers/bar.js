import * as Type from "../contants/Actiontype"
const initialState = {
    isBar: true,
}
const bar = (state = initialState, action) => {
    switch (action.type) {
        case Type.HIDE_BAR:
            return {
                ...state,
                isBar: false
            }
        case Type.SHOW_BAR:
            return {
                ...state,
                isBar: true
            }
        default:
            return state
    }
}
export default bar;