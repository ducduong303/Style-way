
// import './App.css';
// import axios from "axios"
// import Login from './components/Login';
// import Note from './components/Note';
// import { useState, useEffect } from 'react';
// function App() {

//     const [isLogin, setIsLogin] = useState(false)
//     useEffect(() => {
//         const checkLogin = async () => {
//             const token = localStorage.getItem('tokenStore')
//             if (token) {
//                 const verified = await axios.get('/users/verify', {
//                     headers: { Authorization: token }
//                 })
//                 console.log(verified)
//                 setIsLogin(verified.data)
//                 if (verified.data === false) return localStorage.clear()
//             } else {
//                 setIsLogin(false)
//             }
//         }
//         checkLogin()
//     }, [])
//     return (
//         <div className="App">
//             <h4>Heloo appp</h4>
//             {
//                 isLogin ? <Note setIsLogin={setIsLogin}></Note> : <Login setIsLogin={setIsLogin}></Login>
//             }


//         </div>
//     );
// }

// export default App;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { ActGettoken, ActGetUser } from './action/auth';
import './App.scss';
// import "./styles/basic.scss";
import { history } from "./common/history";
import Loading from './common/Loading';
import * as Type from "./contants/Actiontype";

import Tutorial from './page/Tutorial';
import BlogDetail from './components/Blog/BlogDetail';


const Contact = React.lazy(() => import('./page/Contact'));
const Blogger = React.lazy(() => import('./page/Blogger'));
const Profile = React.lazy(() => import('./components/Profile'));
const ProductFilter = React.lazy(() => import('./components/Products/ProductFilter'));
const ForgotPassword = React.lazy(() => import('./components/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./components/ResetPassword'));
const ActiveMail = React.lazy(() => import('./components/ActiveMail'));
const Cart = React.lazy(() => import('./components/Cart/Cart'));
const Shipping = React.lazy(() => import('./components/Checkout/Shipping'));
const WishList = React.lazy(() => import('./components/WishList'));
const NotFound = React.lazy(() => import('./common/NotFound'));
const User = React.lazy(() => import('./page/User'));
const Admin = React.lazy(() => import('./page/Admin'));
const Login = React.lazy(() => import('./page/Login'));
const Register = React.lazy(() => import('./page/Register'));
const ProductDetail = React.lazy(() => import('./components/Products/ProductDetail'));
// const ProductManager = React.lazy(() => import('./components/Products/ProductManager'));

function App() {


    const dispatch = useDispatch()
    const auth = useSelector(state => state.auth)
    const { isLogger, isAdmin } = auth
    // const cart = useSelector(state => state.cart)
    const token = useSelector(state => state.token)


    // useEffect(() => {
    //     const addCart = async () => {
    //         const res = http.post("/addCart", {
    //             cart
    //         })
    //     }
    //     addCart()
    // }, [cart])
    // []
    useEffect(() => {
        const isLogin = localStorage.getItem("isLogin")
        if (isLogin) {
            dispatch(ActGettoken())
        }
    }, [auth.isLogger, dispatch])
    // []

    useEffect(() => {
        if (token) {
            dispatch({
                type: Type.LOGIN_SUCCESS,
            })
            dispatch(ActGetUser())
        }
    }, [token, dispatch])
    useEffect(() => {
        document.querySelector(".App").scrollTop = 0;
    }, [])
    return (
        <Router history={history}>
            <React.Suspense fallback={<Loading></Loading>}>
                <div className="App">
                    <Switch>
                        <Route exact path="/" component={User}></Route>
                        <Route exact path="/login" component={Login}></Route>
                        <Route exact path="/register" render={() => {
                            return isLogger ? <Redirect to="/"></Redirect> : < Register />
                        }}></Route>
                        <Route exact path="/profile" component={isLogger ? Profile : NotFound}></Route>
                        <Route exact path="/user/reset/:token" component={ResetPassword} ></Route>
                        <Route exact path="/forgot-password" component={ForgotPassword} ></Route>
                        <Route exact path="/user/activate/:activation_token" component={ActiveMail} ></Route>
                        <Route exact path="/product-detail/:id" component={ProductDetail}></Route>
                        <Route exact path="/wishlist" component={isLogger ? WishList : NotFound}></Route>
                        <Route exact path="/cart" component={isLogger ? Cart : NotFound}></Route>
                        <Route exact path="/cart/shipping" component={isLogger ? Shipping : NotFound}></Route>
                        <Route exact path="/products" component={ProductFilter}></Route>
                        <Route exact path="/blogs" component={Blogger}></Route>
                        <Route exact path="/contact" component={Contact}></Route>
                        <Route exact path="/tutorial" component={Tutorial}></Route>
                        <Route exact path="/blogs/:id" component={BlogDetail}></Route>

                        <Route exact path="/admin" component={isAdmin && isLogger ? Admin : NotFound}></Route>
                        {/* <Route  path="*" component={NotFound}></Route> */}
                    </Switch>
                    {/* <Body></Body> */}
                </div>
            </React.Suspense>
        </Router>
    );
}

export default App;

