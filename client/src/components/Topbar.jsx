import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Popover, Badge } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { ActLogOut } from '../action/auth';
import { clearCart } from '../action/cart';
import logo from "../assets/image/logo.jpg";
import search from "../assets/image/search.svg";
import wishlist from "../assets/image/wishlist.svg";
import cartImg from "../assets/image/cart.svg";
import userImg from "../assets/image/user.svg";
import { AiOutlineBars } from 'react-icons/ai';
import * as Type from "../contants/Actiontype"
function TopBar(props) {



    const auth = useSelector(state => state.auth)
    const cart = useSelector(state => state.cart)
    const history = useHistory()
    const dispatch = useDispatch()
    const { user, isLogger, isAdmin } = auth;

    const handleLogout = () => {
        dispatch(ActLogOut())
        dispatch(clearCart())
        hide()
        history.push("/")
    }



    const handleSearch = () => {

    }

    const content = () => {
        let html;
        if (isLogger) {
            html = <div className="user-info">
                {
                    isAdmin && <Link Link to="/admin" onClick={hide}>Quản trị</Link >
                }
                <Link Link to="/profile" onClick={hide}> Trang cá nhân</Link >
                <Link to="/" onClick={handleLogout}> Đăng xuất</Link>
            </div >
        } else {
            html = <div className="user-info">
                <Link Link to="/login" onClick={hide}> Đăng nhập</Link >
                <Link to="register" onClick={hide}>Đăng ký</Link>
            </div >
        }
        return html

    }

    const [clicked, setClicked] = useState(false)


    const hide = () => {
        setClicked(false)
    }
    const handleClickChange = (visible) => {
        setClicked(visible)
    }


    const [statusBar, setStatusBar] = useState(true)
    const handleBar = () => {
        if (statusBar) {
            dispatch({ type: Type.HIDE_BAR })
            setStatusBar(false)
        } else {
            dispatch({ type: Type.SHOW_BAR })
            setStatusBar(true)
        }

    }
    return (
        <div className={`topbar `}>
            <div className="topbar-container">
                <div className="topleft">
                    <div className="bar">
                        <AiOutlineBars size={25} onClick={handleBar} />
                    </div>
                </div>

                <div className="topright">
                    <img src={search} alt="" className="icon-search" onClick={handleSearch} />
                    {
                        isLogger ? (
                            <div >
                                <Popover
                                    getPopupContainer={trigger => trigger.parentNode} // giúp cỗ định khi scroll
                                    // className="popver"
                                    trigger="click"
                                    visible={clicked}
                                    onVisibleChange={handleClickChange}
                                    content={content()}
                                >
                                    <img src={user?.avatar} className="avatar" alt="" />
                                </Popover>
                            </div>
                        ) : <Popover
                            getPopupContainer={trigger => trigger.parentNode} // giúp cỗ định khi scroll
                            trigger="click"
                            visible={clicked}
                            onVisibleChange={handleClickChange}
                            content={content()}
                        >
                                <img src={userImg} alt="" className="icon-user" />
                            </Popover>
                    }
                    <Link to="/wishlist"><img src={wishlist} alt="" className="icon-wishlist" /></Link>

                    <Badge style={{ backgroundColor: '#000' }} count={cart.length} size="small" showZero offset={[0, 10]}>
                        <Link to="/cart">  <img src={cartImg} alt="" className="icon-cart" /></Link>
                    </Badge>
                </div>
            </div>
        </div>
    );
}

export default TopBar;