import * as Type from "../contants/Actiontype"

export const showDrawer = () => {
    return {
        type: Type.SHOW_DRAWER,
    }
}
export const hideDrawer = () => {
    return {
        type: Type.HIDE_DRAWER,
    }
}