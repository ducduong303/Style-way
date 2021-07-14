import React, { useState, useEffect } from 'react';
import { Link, useHistory } from "react-router-dom"
import { Rate, Tooltip } from 'antd';
import { AiOutlineHeart, AiFillHeart, AiOutlineEye } from 'react-icons/ai';
import http from '../../api/http';
import { useSelector, useDispatch } from 'react-redux';
import { NotificationError, NotificationSuccess } from '../../common/Notification';
import * as Type from "../../contants/Actiontype";
import { ActGetUser } from '../../action/auth';
function ProductItem({ item, noClass, col }) {
    const dispatch = useDispatch();
    const history = useHistory()
    const [wish, setWish] = useState(false)
    const [loadWish, setLoadWish] = useState(false)
    const auth = useSelector(state => state.auth)
    const { user, isLogger } = auth

    useEffect(() => {
        if (user?.wishlist?.find(i => i._id === item._id)) {
            setWish(true)
        } else {
            setWish(false)
        }
    }, [user.wishlist, item._id, isLogger])
    const handleSetWish = async (product) => {
        if (isLogger) {
            if (loadWish) return;
            setWish(true)
            setLoadWish(true)
            const res = await http.post(`/addWishlist`, {
                productID: product._id
            })
            if (res?.status === 200) {
                setLoadWish(false)
                dispatch(ActGetUser())
                NotificationSuccess("", "Thêm thành công sản phẩm vào danh sách yêu thích")
            }
        } else {
            NotificationError("", "Vui lòng đăng nhập")
        }

    }

    const handleUnSetWish = async (product) => {

        if (isLogger) {
            if (loadWish) return;
            setWish(false)
            setLoadWish(true)
            const res = await http.post(`/removeWishlist`, {
                productID: product._id
            })
            if (res?.status === 200) {
                setLoadWish(false)
                dispatch(ActGetUser())
                NotificationSuccess("", "Bạn đã xóa sản phẩm khỏi danh sách yêu thích")
            }
        } else {
            NotificationError("", "Vui lòng đăng nhập")
        }

    }
    const handleview = (id) => {
        history.push(`/product-detail/${id}`)
    }

    const textWish = <span>thêm yêu thích</span>;
    const textView = <span>xem chi tiết</span>;

    const classCheck = noClass ? "col-lg-3" : "col-lg-3 col-md-4 col-sm-6 col-xs-6"
    const classProp = col ? col : null
    // noClass ? "col-lg-3" : `col-lg-3 col-md-4 col-sm-6 col-xs-6`
    return (

        <div className={`${classCheck} ${classProp}`} key={item._id}>
            <div className="product-items">
                <div className="product-img">
                    <img src={item.images[0].url} alt="" />
                    <Link to={`/product-detail/${item._id}`} >

                        <h5 className="add-product"><button>Thêm vào giỏ hàng</button></h5>
                    </Link>

                </div>

                <Rate disabled defaultValue={item.rating} /> <span>{item.numberReview} đánh giá</span>
                <Link to={`/product-detail/${item._id}`}><h3 className="product-name">{item.name} </h3></Link>
                <h4 className="product-price">Giá: {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VND</h4><span>đã bán ({item.sold})</span>

                <br />
                <div className="option">

                    {
                        wish ?
                            <Tooltip placement="left" title={textWish}>
                                <div className="wishlist" onClick={() => handleUnSetWish(item)}>
                                    <AiFillHeart size={15} />
                                </div>
                            </Tooltip>
                            : <Tooltip placement="left" title={textWish}>
                                <div className="wishlist" onClick={() => handleSetWish(item)}>
                                    <AiOutlineHeart size={15} />
                                </div>
                            </Tooltip>
                    }
                    <Tooltip placement="left" title={textView}>
                        <div className="view" onClick={() => handleview(item._id)}>
                            <AiOutlineEye size={15} />
                        </div>
                    </Tooltip>
                </div>
            </div>
        </div >
    );
}

export default ProductItem;