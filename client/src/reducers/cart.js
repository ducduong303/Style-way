import * as Type from "../contants/Actiontype"
// const initiallState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []
const cart = (state = [], action) => {
    const { product } = action;
    let index = -1
    switch (action.type) {
        case Type.ADD_TO_CART:
            index = checkCart(state, product)
            if (index !== -1) {
                state[index].count += product.count
            } else {
                state.push(product)
            }
            // localStorage.setItem("cart", JSON.stringify(state))
            return [...state]
        case Type.GET_CART:
            // state.concat(action.cart)
            return [...action.cart]
        case Type.INCREMENT:
            index = findProduct(state, action.product);
            if (index !== -1) {
                state[index].count += 1
            }
            return [...state]
        case Type.DECREMENT:
            index = findProduct(state, action.product);
            if (index !== -1) {
                if (state[index].count > 1) {
                    state[index].count -= 1
                }
            }
            return [...state]
        case Type.DELETE_PRODUCT:
            // console.log(action)
            index = findProduct(state, action.product);
            if (index !== -1) {
                state.splice(index, 1)
            }
            return [...state]
        case Type.DELETE_ALL_PRODUCT:
            state = filterAll(state, action.product)
            return [...state]
        case Type.CLEAR_CART:
            // state = []
            return []
        default:
            return state
    }
}

const filterAll = (cart, product) => {
    return cart.filter((item, index) => {
        return !product.includes(item.key)
    })
}
const findProduct = (cart, product) => {
    let index = -1;
    if (cart.length > 0) {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i] === product) {
                index = i;
                break;
            }
        }
    }
    return index;
}
const checkCart = (cart, product) => {
    var index = -1;
    if (cart.length > 0) {
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].id === product.id) {
                if (cart[i].size === product.size && cart[i].color.color === product.color.color) {
                    index = i;
                    break;
                }
                else if (cart[i].size === product.size && cart[i].color.color !== product.color.color) {
                    index = -1
                }
                else if (cart[i].size !== product.size && cart[i].color.color === product.color.color) {
                    index = -1
                }
            } else {
                index = -1
            }
        }
    }
    return index;
}
export default cart