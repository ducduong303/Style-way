import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';


import CreateBanner from "../components/Banner/CreateBanner";
import NotFound from '../common/NotFound';
import ProductManager from '../components/Products/ProductManager';
import CreateProduct from '../components/Products/CreateProduct';
import OderManager from '../components/Oder/OderManager';
import OderDetail from '../components/Oder/OderDetail';
import UserManager from '../components/Users/UserManager';
import Colors from '../components/Colors/Colors';
import Sizes from '../components/Sizes/Sizes';
import Category from '../components/Category/Category';
import BlogManager from '../components/Blog/BlogManager';
import CreateBlog from '../components/Blog/CreateBlog';
import HomeAdmin from './HomeAdmin';


// const CreateBanner = React.lazy(() => import('../components/Banner/CreateBanner'));
// const NotFound = React.lazy(() => import('../common/NotFound'));
// const ProductManager = React.lazy(() => import('../components/Products/ProductManager'));
// const CreateProduct = React.lazy(() => import('../components/Products/CreateProduct'));
// const OderManager = React.lazy(() => import('../components/Oder/OderManager'));



function MainAdmin(props) {
    const auth = useSelector(state => state.auth)
    const { isLogger, isAdmin } = auth
    return (
        <div className="home contentFlx4"> 
            <div className="container-screen">
                <Route exact path="/admin" component={HomeAdmin}></Route>
                <Route exact path="/admin/products" component={ProductManager}></Route>
                <Route exact path="/admin/edit-product/:id" component={isAdmin && isLogger ? CreateProduct : NotFound}></Route>
                <Route exact path="/admin/create-banner" component={isAdmin && isLogger ? CreateBanner : NotFound}></Route>
                <Route exact path="/admin/create-product" component={isAdmin && isLogger ? CreateProduct : NotFound}></Route>
                <Route exact path="/admin/oder-manager" component={isAdmin && isLogger ? OderManager : NotFound}></Route>
                <Route exact path="/admin/oder-manager/:id" component={isAdmin && isLogger ? OderDetail : NotFound}></Route>
                <Route exact path="/admin/manager-user" component={isAdmin && isLogger ? UserManager : NotFound}></Route>
                <Route exact path="/admin/size" component={isAdmin && isLogger ? Sizes : NotFound}></Route>
                <Route exact path="/admin/color" component={isAdmin && isLogger ? Colors : NotFound}></Route>
                <Route exact path="/admin/category" component={isAdmin && isLogger ? Category : NotFound}></Route>
                <Route exact path="/admin/blog" component={isAdmin && isLogger ? BlogManager : NotFound}></Route>
                <Route exact path="/admin/create-blog" component={isAdmin && isLogger ? CreateBlog : NotFound}></Route>
                <Route exact path="/admin/edit-blog/:id" component={isAdmin && isLogger ? CreateBlog : NotFound}></Route>
            </div>
        </div>
    );
}

export default MainAdmin;