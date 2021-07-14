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

function Header(props) {
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

    const renderUser = () => {
        return (
            <>
                <li>
                    <Link to="/profile">
                        Profile
                    </Link>
                </li>
                <li>
                    <Link to="/myoder">
                        MyOder
                    </Link>
                </li>
                {
                    isAdmin && <li>
                        <Link to="/products">
                            Products
                    </Link>
                    </li>
                }
                {
                    isAdmin && <li>
                        <Link to="/category">
                            Category
                    </Link>
                    </li>
                }
                {
                    isAdmin && <li>
                        <Link to="/size">
                            Size
                    </Link>
                    </li>
                }
                {
                    isAdmin && <li>
                        <Link to="/create-banner">
                            Banner
                    </Link>
                    </li>
                }
                {
                    isAdmin && <li>
                        <Link to="/color">
                            Color
                    </Link>
                    </li>
                }
                {
                    isAdmin && <li>
                        <Link to="/oder-manager">
                            Oder
                    </Link>
                    </li>
                }
                <li>
                    <Link to="/wishlist" >
                        WishList({user?.wishlist?.length})
                </Link>
                </li>
                <li>
                    <Link to="/cart" >
                        Cart({cart.length})
                </Link>
                </li>
                <li>
                    <Link to="/" onClick={handleLogout}>
                        Logout
                </Link>
                </li>
            </>
        )
    }

    const [statusSearch, setStatusSearch] = useState(false)
    const handleSearch = () => {
        setStatusSearch(!statusSearch)
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

    useEffect(() => {
        const listMenu = document.querySelector('.header')
        window.addEventListener('scroll', () => {
            if (window.scrollY > 150) {
                listMenu.classList.add('active')
            } else {
                listMenu.classList.remove('active')
            }
        })
    }, [])

    return (
        <>
            {
                statusSearch && <div className="overlay-search">
                    <button onClick={() => setStatusSearch(false)} className="overlay-close">x</button>
                    <form className="overSearch-form">
                        <input className="inputCustom " type="text" placeholder="Nhập để tìm kiếm" />
                        <button className="btn-add">Tìm kiếm</button>
                    </form>
                </div>
            }

            <div className="header">
                <div className="container">
                    <div className="header-nav">
                        <h3><Link to="/" style={{ color: "#fff" }}>
                            <img src={logo} alt="" style={{ width: "168px", height: "35px" }} /></Link></h3>
                        <ul className="header-center">
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/products">Sản phẩm</Link></li>
                            <li><Link to="/blogs">Bài viết</Link></li>
                            <li><Link to="/contact">Liên hệ</Link></li>
                            <li><Link to="/tutorial">Hướng dẫn</Link> </li>
                            {/* {
                            isLogger ? renderUser() :
                                <>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/register">Register</Link></li>
                                </>
                        } */}
                        </ul>
                        <div className="header-right">
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
            </div>
        </>
    );
}

export default Header;