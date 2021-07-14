import * as Type from "../contants/Actiontype"
const initialState = {
    loading: false,
    pageNumber: localStorage.getItem("page") ? parseInt(localStorage.getItem("page")) : 1,
    currentPageNumber: localStorage.getItem("page") ? parseInt(localStorage.getItem("page")) : 1,
}
const products = (state = initialState, action) => {
    switch (action.type) {
        case Type.SET_LOADING:
            return {
                ...state,
                loading: true
            }
        case Type.REMOVE_LOADING:
            return {
                ...state,
                loading: false
            }
        case Type.CHANGEPAGE:
            return {
                ...state,
                pageNumber: action.page,
                currentPageNumber: action.page,
            }
   
        default:
            return state
    }
}
export default products