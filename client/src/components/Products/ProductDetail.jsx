import { Button, Popover, Rate, Tabs, Tag, Image, Pagination } from 'antd';
import React, { useEffect, useState } from 'react';
import { BsChevronLeft, BsChevronRight, BsFillImageFill, BsHeart } from 'react-icons/bs';
import ReactImageMagnify from 'react-image-magnify';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { addToCart } from '../../action/cart';
import http from '../../api/http';
import { NotificationError } from '../../common/Notification';
import * as Type from "../../contants/Actiontype";
import { ImageUpload } from "../../common/ImageUpload"
import Header from '../Header';
import LoadingSection from '../../common/LoadingSection';
import TitleCustom from '../TitleCustom';
import ProductRelated from './ProductRelated';
import Footer from "../Footer"
const { TabPane } = Tabs;
function ProductDetail(props) {
    const { match } = props;
    const dispatch = useDispatch()
    const history = useHistory()
    const id = match.params.id
    const [productDetail, setProductDetail] = useState({})
    const StatusLoading = useSelector(state => state.products)
    const auth = useSelector(state => state.auth);
    const { user } = auth
    const cart = useSelector(state => state.cart);
    const [countIn, setCountIn] = useState(0)
    const getCountIn = () => {
        cart.forEach((item, index) => {
            if (item.id === id) {
                setCountIn(item.count)
            }
        })
    }




    const { isLogger, isAdmin } = auth
    // const { loading } = StatusLoading;
    const [loading, setLoading] = useState(false)
    const [cateGory, setCateGory] = useState("")
    const [productRelated, setProductRelated] = useState([])
    const fetchData = async () => {
        try {
            setLoading(true)
            // dispatch({ type: Type.SET_LOADING })
            const res = await http.get(`/products/${id}`)
            if (res?.status === 200) {
                // console.log(res.data.images)
                // console.log(res)
                setLoading(false)
                window.scrollTo(0, 0)
                // dispatch({ type: Type.REMOVE_LOADING })
                setProductDetail(res.data)
                setSize(res.data.sizes[0])
                setIndexSize(0)
                setColor(res.data.colors[0])
                setSubColor(res.data.colors[0].name)
                setIndexColor(0)

            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [id])
    useEffect(() => {
        getCountIn()
    }, [cart])


    const [indexImg, setIndexImg] = useState(0);
    const [size, setSize] = useState();
    const [indexSize, setIndexSize] = useState(null);
    const [color, setColor] = useState(null);
    const [indexColor, setIndexColor] = useState(null);
    const [subColor, setSubColor] = useState('')
    const [count, setCount] = useState(1)
    const handleSelectSize = (size, index) => {
        setSize(size);
        setIndexSize(index)
    }
    const handleSelectColor = (color, index) => {
        setColor(color)
        setIndexColor(index)
        setSubColor(color.name)
    }

    const ClickNext = () => {
        if (indexImg === productDetail.images.length - 1) {
            setIndexImg(0)
        } else {
            setIndexImg(prev => prev + 1)
        }
    }
    const ClickPrev = () => {
        if (indexImg === 0) {
            setIndexImg(productDetail.images.length - 1)
        } else {
            setIndexImg(prev => prev - 1)
        }
    }


    const handleAddToCart = () => {
        if (countIn < productDetail.countInStock) {
            // if (size === "" || color === "") {
            //     NotificationError("", "Vui lòmng")
            // }
            const product = {
                id: productDetail._id,
                name: productDetail.name,
                count,
                countInStock: productDetail.countInStock,
                sold: productDetail.sold,
                size: size ? size : "Fire size",
                color: color ? color : null,
                price: productDetail.price,
                image: productDetail?.images?.[indexImg]?.url,
                key: uuidv4(),
            }
            // console.log("product", product);
            if (isLogger) {
                dispatch(addToCart(product))
                // dispatch(showDrawer())
            } else {
                NotificationError("", "Vui lòng đăng nhập")
                history.push("/login")
            }
        } else {
            alert("lỗi thêm giỏ hàng")
        }

    }
    const increaseCount = () => {
        if (count > 1) {
            setCount(currentCount => currentCount - 1)
        } else {
            setCount(1)
        }
    }
    const decreaseCount = () => {
        if (count < productDetail.countInStock) {
            setCount(currentCount => currentCount + 1)
        }
    }

    // Comment

    // const [totalComment, setTotalComment] = useState(0)
    // const [currentPageComment, setcurrentPageComment] = useState(1)
    const [listReviews, setListReviews] = useState([])
    const [comment, setComment] = useState("")
    const [rating, setRating] = useState(0)
    const [imageReview, setImageReview] = useState([])



    const handleChangeImgaeReview = (e) => {
        const fileArr = [...e.target.files]
        let newImages = [];

        fileArr.forEach(file => {
            if (!file) {
                NotificationError("", "Chưa chọn file")
                return
            }
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                NotificationError("", "File không đúng định dạng")
                return;
            }
            return newImages.push(file)
        })
        setImageReview([...imageReview, ...newImages])
    }
    const handleDeletePreview = (index) => {
        const cloneData = [...imageReview]
        cloneData.splice(index, 1)
        setImageReview(cloneData)
    }
    const fetChListReviews = async (pageIndex) => {
        const res = await http.get(`/products/reviews/${id}?page=${pageIndex}&limit=50`)
        if (res?.status === 200) {
            // const data = res?.data?.reviews;
            setListReviews(res?.data?.reviews.reverse())
            // setTotalComment(res?.data?.totalItem)
        }
    }
    useEffect(() => {
        fetChListReviews(1)
    }, [])
    const handleChangeComment = (e) => {
        setComment(e.target.value)
    }
    const handleChangeRating = (value) => {
        setRating(value)
    }
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        let media = []
        if (imageReview.length > 0) media = await ImageUpload(imageReview)
        // console.log("media", media)
        const res = await http.put(`products/review`, {
            rating,
            comment,
            productId: id,
            images: media
        })
        if (res?.status === 200) {
            fetChListReviews(1)
            setProductDetail({
                ...res?.data?.product,
                reviews: res?.data?.product?.reviews,
                numberReview: res?.data?.product?.numberReview,
                rating: res?.data?.product?.rating
            })
            setRating(0)
            setComment('')
            setImageReview([])
        }
    }

    const handleRemoveReivew = async (idReview, user, image) => {
        // console.log({ idReview, user, image, id })
        const res = await http.post(`/products/delete_review/${id}`, {
            idReview: idReview,
            user: user
        })
        if (res?.status === 200) {
            fetChListReviews(1)
            setProductDetail({
                ...res?.data?.reviewUpdate,
                reviews: res?.data?.reviewUpdate?.reviews,
                numberReview: res?.data?.reviewUpdate?.numberReview,
                rating: res?.data?.reviewUpdate?.rating
            })
        }
        const idImage = image?.images?.map((item => item.public_id))
        idImage?.forEach((item, index) => {
            const rs = http.post("/image/destroy-image", {
                public_id: item
            })
        })
    }
    return (
        <>
            <Header></Header>
            <TitleCustom name={productDetail?.name}></TitleCustom>
            {
                !loading ? <div className="product-detail mt-2">
                    <div className="container">
                        <div className="detail-content row">
                            <div className="col-lg-6">
                                <div className="detail-content__img row">
                                    <div className="col-lg-2  detail-content__img-thumbslist">
                                        {
                                            productDetail?.images?.map((item, index) => {
                                                return (
                                                    <img
                                                        className="detail-content__img-thumbs"
                                                        src={item.url} alt=""
                                                        key={index}
                                                        style={{ border: indexImg === index ? "1px solid #c99947" : "1px solid transparent", opacity: indexImg === index ? 1 : 0.5 }}
                                                        onClick={() => setIndexImg(index)}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="col-lg-10 detail-content__img-imgbig">
                                        <button className="detail-content__img-btn detail-content__img-next" onClick={ClickNext} ><BsChevronRight size={25} /></button>
                                        <button className="detail-content__img-btn detail-content__img-prev" onClick={ClickPrev}><BsChevronLeft size={25} /></button>
                                        <ReactImageMagnify {...{
                                            smallImage: {
                                                alt: 'Wristwatch by Ted Baker London',
                                                isFluidWidth: true,
                                                src: productDetail?.images?.[indexImg]?.url || "https://i.stack.imgur.com/y9DpT.jpg",
                                            },
                                            largeImage: {
                                                src: productDetail?.images?.[indexImg]?.url || "https://i.stack.imgur.com/y9DpT.jpg",
                                                width: 1200,
                                                height: 1800,
                                            },
                                            enlargedImageContainerDimensions: {
                                                width: '100%',
                                                height: '100%',
                                            },
                                            lensStyle: {
                                                background: 'hsla(0, 0%, 100%, .3)',
                                            }
                                        }} />
                                    </div>
                                </div>
                            </div>
                            <div className=" col-lg-6">
                                <div className="detail-content__desc">
                                    <h3>{productDetail?.name}</h3>
                                    <div className="detail-content__desc-rating">
                                        <span>({productDetail?.numberReview}) đánh giá</span> <span style={{ paddingLeft: "5px" }}> <Rate disabled value={productDetail?.rating}></Rate></span>
                                    </div>

                                    <h4 className="detail-content__desc-price">Giá :{productDetail?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ</h4>
                                    <div style={{ marginTop: "1rem" }}>
                                        <h4>Mô tả :</h4>
                                        <span dangerouslySetInnerHTML={{ __html: `${productDetail?.description?.slice(0, 50)}...` }}></span>

                                    </div>
                                    {
                                        productDetail?.sizes?.length > 0 &&
                                        (
                                            <h4>Kích cỡ :
                                        {
                                                    productDetail?.sizes?.map((item, index) => {
                                                        return (
                                                            <button key={index}
                                                                className="btn-detail btn-size"
                                                                style={{
                                                                    // padding: "5px", margin: "0 5px",
                                                                    border: indexSize === index ? "2px solid #e74c3c" : null,

                                                                }}
                                                                onClick={() => handleSelectSize(item, index)}

                                                            >{item}</button>
                                                        )
                                                    })
                                                }
                                            </h4>
                                        )
                                    }
                                    {
                                        productDetail?.colors?.length > 0 && (
                                            <h4 className="detail-content__desc-color">Màu:
                                                {
                                                    productDetail?.colors?.map((item, index) => {
                                                        return (
                                                            <Popover
                                                                // overlayStyle={{ background: item.color }}
                                                                content={() => <Tag style={{ color: item.color, }} color={item.color}>
                                                                    <p>{item.name}</p>

                                                                </Tag>} key={index}>
                                                                <button
                                                                    className="btn-detail btn-size"
                                                                    onClick={() => handleSelectColor(item, index)}
                                                                    style={{
                                                                        background: item.color,
                                                                        // width: "30px",
                                                                        // height: "30px",
                                                                        // margin: "0 5px",
                                                                        border: indexColor === index ? "2px solid #e74c3c" : null,
                                                                    }}
                                                                >
                                                                </button>
                                                            </Popover>
                                                        )
                                                    })
                                                }
                                                {/* <span className="mt-1"> {subColor}</span> */}
                                            </h4>

                                        )
                                    }

                                    <div className="detail-content__desc-count">
                                        <h4>Số lượng:</h4>
                                        <div>
                                            <button onClick={increaseCount} disabled={count === 1}>-</button>
                                            <button>{count}</button>
                                            <button onClick={decreaseCount} disabled={count + countIn >= productDetail.countInStock}>+</button>
                                        </div>
                                    </div>
                                    <div className="detail-content__desc-status">
                                        <h4>Trạng Thái: {productDetail.countInStock > 0 ? <span className="instock">Còn hàng</span> : <span className="outstock">Hết hàng</span>}</h4>
                                    </div>

                                    <h4>{countIn >= productDetail.countInStock && `${countIn} Sản phẩm hiện có trong giỏ hàng `}</h4>
                                    <button className="detail-content__desc-addCart"
                                        onClick={handleAddToCart}
                                        disabled={productDetail.countInStock === 0 || countIn >= productDetail.countInStock}>
                                        {
                                            productDetail.countInStock === 0 || countIn >= productDetail.countInStock ? "Hết Hàng" : "Thêm vào giỏ hàng"
                                        }
                                    </button>
                                    {/* <p href="/" className="detail-content__desc-wishlist"><BsHeart size={20} /><h4>Thêm yêu thích</h4></p> */}
                                </div>
                            </div>
                        </div>

                        <div className="product-footer ">
                            <Tabs defaultActiveKey="1" centered>
                                <TabPane tab={<h4>Mô tả sản phẩm</h4>} key="1">
                                    <h4><span dangerouslySetInnerHTML={{ __html: productDetail.description }}></span></h4>
                                </TabPane>
                                <TabPane tab={<h4>Đánh giá và Nhận xét</h4>} key="2">
                                    {
                                        isLogger ?
                                            <>
                                                <form onSubmit={handleSubmitComment} className="form-review">
                                                    {/* <div className="form-rating">
                                                        <Rate value={rating} name="rating" onChange={handleChangeRating}></Rate>
                                                    </div> */}
                                                    <div className="form-content">
                                                        <img src={user?.avatar} className="avatar" alt="avatar"></img>
                                                        <textarea type="text" placeholder="Viết nhận xét"
                                                            name="comment"
                                                            value={comment}
                                                            rows="4" cols="50"
                                                            onChange={handleChangeComment} />
                                                    </div>
                                                    <div>
                                                        <h5>Đánh giá sao: <Rate value={rating} name="rating" onChange={handleChangeRating}></Rate></h5>
                                                    </div>
                                                    <h5>Chọn hình ảnh :
                                                        <input type="file" id="img-product" accept="image/*"
                                                            onChange={handleChangeImgaeReview}
                                                            multiple>
                                                        </input>
                                                        <label htmlFor="img-product">
                                                            <span style={{ marginLeft: "10px" }}> <BsFillImageFill size={25} /></span>
                                                        </label>
                                                        <div style={{ display: "flex" }}>
                                                            {
                                                                imageReview?.map((item, index) => {
                                                                    return (
                                                                        <div key={index} className="img-preview" >
                                                                            <Image
                                                                                src={item?.url ? item?.url : URL.createObjectURL(item)}
                                                                                alt=""
                                                                            >
                                                                            </Image>
                                                                            {/* <img src={item.url ? item.url : URL.createObjectURL(item)} alt="" /> */}
                                                                            <span className="deletePreview" onClick={() => handleDeletePreview(index)}>&times;</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>

                                                    </h5>

                                                    <button type="submit" className="btn-Style">Bình luận</button>
                                                </form>
                                                {
                                                    listReviews?.map((item, index) => {
                                                        return (
                                                            <div className="comment-item">
                                                                <div className="comment-avatar">
                                                                    <div>
                                                                        <img src={item?.user?.avatar} className="avatar" alt="avatar"></img> {item?.user?.name}
                                                                    </div>
                                                                    <p>
                                                                        {new Date(item?.createdAt).toLocaleString()}
                                                                        {
                                                                            item?.user?._id === auth?.user?._id ? <Button style={{ marginLeft: "20px" }} onClick={() => handleRemoveReivew(item._id, item.user._id, item)}>Xóa</Button> : null
                                                                        }
                                                                    </p>
                                                                </div>

                                                                <Rate value={item.rating} disabled ></Rate>
                                                                <h4>{item.comment}</h4>
                                                                {
                                                                    item.images.length > 0 ? item.images.map((item, index) => {
                                                                        return (
                                                                            <img key={item.public_id} src={item?.url} style={{ width: "110px", height: "120px", margin: "0 20px", marginLeft: "0" }}></img>
                                                                        )
                                                                    }) : null
                                                                }
                                                                {/* {
                                                                    item?.user?._id === auth?.user?._id ? <Button onClick={() => handleRemoveReivew(item._id, item.user._id, item)}>Xóa</Button> : null
                                                                } */}
                                                            </div>

                                                        )
                                                    })
                                                }
                                            </>

                                            :
                                            <div>
                                                <h4>Vui lòng đăng nhập để có thể đánh giá và nhận xét sản phẩm</h4>
                                                {
                                                    listReviews?.map((item, index) => {
                                                        return (
                                                            <div key={item._id}>
                                                                <div>
                                                                    <img src={item?.user?.avatar} className="avatar" alt="avatar"></img> {item?.user?.name}
                                                                </div>
                                                                <Rate value={item.rating} disabled ></Rate>
                                                                <h4>{item.comment}</h4>
                                                            </div>

                                                        )
                                                    })
                                                }
                                            </div>
                                    }
                                </TabPane>
                            </Tabs>
                        </div>
                        <ProductRelated category={productDetail?.category} ></ProductRelated>
                    </div>
                </div> : <LoadingSection height="300px"></LoadingSection>
            }


            <Footer></Footer>


        </>
    );
}

export default ProductDetail;