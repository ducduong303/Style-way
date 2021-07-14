import { combineReducers } from "redux";
import auth from "./auth"
import token from "./getAccessToken"
import products from "./products"
import cart from "./cart"
import drawer from "./drawer"
import shipping from "./shipping"
import bar from "./bar"
const myReducer = combineReducers({
    auth,
    token,
    products,
    cart,
    drawer,
    shipping,
    bar
})
export default myReducer