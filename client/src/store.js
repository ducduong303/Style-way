import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import myReducer from "./reducers/index";

const store = createStore(
    myReducer,
    compose(applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
)
export default store