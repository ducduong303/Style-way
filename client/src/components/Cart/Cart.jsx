import { Button, Checkbox, Modal, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { deCrement, inCrement, removeAllProduct, removeProduct } from "../../action/cart";
import Loading from '../../common/Loading';
import { NotificationError, NotificationSuccess } from '../../common/Notification';
import Footer from '../Footer';
import Header from '../Header';
import TitlePage from "../TitlePage"
function Cart(props) {
    const history = useHistory()
    const auth = useSelector(state => state.auth)
    const cart = useSelector(state => state.cart)
    const dispatch = useDispatch()
    const [dataSource, setDataSource] = useState([]);
    const [total, setTotal] = useState(0)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [cartCheckOut, setCartCheckOut] = useState([])
    // const { cart } = auth.user;
    useEffect(() => [
        setDataSource(cart),
    ], [cart])

    useEffect(() => {
        getTotal()
    }, [cart, selectedRowKeys])

    const getTotal = () => {
        const total = cartCheckOut?.reduce((prev, item) => {
            return prev + (item.price * item.count)
        }, 0)
        setTotal(total)
    }


    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'id',
            key: 'id',
            // width: 300,
            sorter: (a, b) => a.name.length - b.name.length,
            render: (id, item, index) => {
                return (
                    // <div>{index + 1}</div>
                    <div style={{ display: "flex" }}>
                        <img src={item.image} alt="" style={{ width: "70px", height: "75px" }} ></img>
                        <div style={{ paddingLeft: '20px' }}>
                            <h4 style={{ padding: "5px" }}>{item.name}</h4>
                        </div>
                    </div >
                )
            }

        },
        {
            // <Tag color="success">Còn hàng</Tag>
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (id, item, index) => {
                return (
                    // <div>{index + 1}</div>
                    <Tag color="error">{item.size}</Tag>
                )
            }
        },
        {
            title: 'Màu',
            dataIndex: 'color',
            key: 'color',
            render: (id, item, index) => {
                return (
                    <>
                        {
                            item?.color ? <Tag color="error">{item?.color?.name}</Tag> : null
                        }
                    </>
                )
            }
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (id, item, index) => {
                return (
                    <div>{item?.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>đ</u></div>
                )
            }
        },
        {
            title: 'Số lượng',
            dataIndex: 'count',
            key: 'count',
            render: (id, item, index) => {
                return (
                    <div>
                        <button className="btn-count" disabled={item.count === 1} onClick={() => handeDecrement(item)}>-</button>
                        <button className="btn-count">{item.count}</button>
                        <button className="btn-count" disabled={item.count >= item.countInStock} onClick={() => handelIncrement(item)}>+</button>
                    </div>
                )
            }
        },
        {
            title: 'Tổng giá',
            dataIndex: 'total',
            key: 'total',
            render: (id, item, index) => {
                const total = item.count * item.price
                return (
                    <div>
                        {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>đ</u>
                    </div>
                )
            }
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            render: (id, item, index) => {
                return (
                    <Button onClick={() => handleDelete(item)}>Xóa</Button>
                    // <div><AiOutlineDelete size={20} /></div>
                )
            }
        },
    ]

    const [loadingUpdate, setLoadingUpdate] = useState(false)
    const handelIncrement = (item) => {
        setLoadingUpdate(true)
        dispatch(inCrement(item)).then(res => {
            setLoadingUpdate(false)
        })

        // Lặp qua  Cart xem có gì thay đổi update lại vào cartCheckOut sản phẩm chọn để check out
        let arr = []
        cart.forEach((item, index) => {
            cartCheckOut.forEach((i, index) => {
                if (item.key === i.key) {
                    arr.push(item)
                }
            })
        })
        setCartCheckOut(arr)

    }
    const handeDecrement = (item) => {
        setLoadingUpdate(true)
        dispatch(deCrement(item)).then(res => {
            setLoadingUpdate(false)
        })
        // Lặp qua  Cart xem có gì thay đổi update lại vào cartCheckOut sản phẩm chọn để check out
        let arr = []
        cart.forEach((item, index) => {
            cartCheckOut.forEach((i, index) => {
                if (item.key === i.key) {
                    arr.push(item)
                }
            })
        })
        setCartCheckOut(arr)
    }

    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const [currentProduct, setCurrentProduct] = useState({})
    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false)
    }
    const handleDelete = (item) => {
        // dispatch(removeProduct(item))
        setCurrentProduct(item)
        setIsShowModalDelete(true)
    }
    const handleOk = () => {
        dispatch(removeProduct(currentProduct))
        NotificationSuccess("", "Xóa thành công")
        handleCloseModalDelete()
    }

    const [check, setcheck] = useState(false)
    // onSelecAll
    const onSelectChange = (selectedRowKeys) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        // Lặp tìm các sản phẩm khách hàng chọn để tính tiền 
        let arr = []
        selectedRowKeys.forEach((item, index) => {
            cart.forEach((i, index) => {
                if (item === i.key) {
                    arr.push(i)
                }
            })
        })
        setCartCheckOut(arr)
        setSelectedRowKeys(selectedRowKeys)

        // Custom chọn tất cả
        if (selectedRowKeys.length > 0) {
            setcheck(true)
        } else {
            setcheck(false)
        }
        if (selectedRowKeys.length < cart.length) {
            setcheck(false)
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    // Custom Chọn tất cả
    const handleCheckAll = (e) => {
        if (e.target.checked) {
            let arr = []
            cart.map((item, index) => {
                arr.push(item.key)
            })
            setCartCheckOut(cart)
            setSelectedRowKeys(arr)
            setcheck(true)
        } else {
            setCartCheckOut([])
            setSelectedRowKeys([])
            setcheck(false)
        }
    }

    const conFirmProduct = () => {
        if (cartCheckOut.length === 0) {
            NotificationError("", "Vui lòng chọn sản phẩm")
        } else {
            localStorage.setItem("oder", JSON.stringify(cartCheckOut))
            localStorage.setItem("oderKey", JSON.stringify(selectedRowKeys))
            history.push("/cart/shipping")
        }
    }

    // Xóa tất cả 

    const [isShowModalDeleteAll, setIsShowModalDeleteAll] = useState(false)
    const handleCloseModalDeleteAll = () => {
        setIsShowModalDeleteAll(false)
    }
    const handleDeleteAll = async () => {
        setIsShowModalDeleteAll(true)
    }
    const handleOkDeleteAll = (e) => {
        dispatch(removeAllProduct(selectedRowKeys)).then(rs => {
            handleCloseModalDeleteAll()
            NotificationSuccess("", rs.msgRemove)
        })
    }

    // if (cart?.length === 0) {
    //     return (
    //         <h4>Chưa có sản phẩm nào <span><Link to="/">Tiếp tục mua sắm</Link></span></h4>
    //     )
    // }
    return (
        <>
            {loadingUpdate ? <Loading></Loading> : null}
            <Header></Header>
            <TitlePage title="Giỏ hàng"></TitlePage>
            {
                cart?.length === 0 ? <div class="cart-empty">
                    <h3>Bạn chưa có sản phẩm nào trong giỏ hàng </h3>
                    <button className="btn-Style"><Link to="/" style={{color:"#fff"}}>Tiếp tục mua hàng</Link></button>
                </div>
                    : <div className="container">
                        <div className="cart ">
                            <div className="col-lg-9">
                                {/* <button disabled={selectedRowKeys.length !== 0 ? false : true} onClick={handleDeleteAll}>Xóa tất cả</button> */}
                                <Table
                                    dataSource={dataSource}
                                    // pagination={false}
                                    scroll={{ x: true }}
                                    pagination={{ defaultPageSize: 10, total: dataSource?.length }}
                                    columns={columns}
                                    rowSelection={rowSelection}
                                    rowKey="key"
                                    title={() =>
                                        <div className="cart-action">
                                            <Checkbox onChange={handleCheckAll} checked={check}>{!check ? "Chọn tất cả" : "Bỏ chọn tất cả"}  </Checkbox>
                                            <button className="btn-cart" disabled={selectedRowKeys.length !== 0 ? false : true} onClick={handleDeleteAll}>Xóa tất cả</button>
                                        </div>
                                    }
                                />
                            </div>
                            <div className="col-lg-3">
                                <div className="info-product">
                                    <h2>Thông tin đơn hàng</h2>
                                    <div className="detail-oder">
                                        <h4>Tạm tính({cartCheckOut.length} sản phẩm)<span>{total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></h4>
                                        <h4>Phí giao hàng: <span>0đ</span></h4>
                                        <h4>Tổng đơn hàng : <span>{total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></h4>
                                    </div>
                                    <button className="btn-cart" onClick={conFirmProduct}>Xác Nhận Đơn Hàng</button>
                                </div>
                            </div>
                        </div>

                        <br></br>

                        <Modal
                            className='career-type-popup'
                            title={`Bạn có chắc chắn muốn xóa sản phẩm " ${currentProduct.name} " không ?`}
                            visible={isShowModalDelete}
                            onCancel={handleCloseModalDelete}
                        >
                            <div className="career-btn">
                                <Button onClick={() => handleCloseModalDelete()} className="status-btn-default">
                                    <span className="l-calendar-name">Không</span>
                                </Button>
                                <Button style={{ marginLeft: '20px' }} onClick={(record) => handleOk(record)} className="status-btn-default">
                                    <span className="l-calendar-name">Có</span>
                                </Button>
                            </div>
                        </Modal>
                        <Modal
                            className='career-type-popup'
                            title={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} sản phẩm  không ?`}
                            visible={isShowModalDeleteAll}
                            onCancel={handleCloseModalDeleteAll}
                        >
                            <div className="career-btn">
                                <Button onClick={() => handleCloseModalDeleteAll()} className="status-btn-default">
                                    <span className="l-calendar-name">Không</span>
                                </Button>
                                <Button style={{ marginLeft: '20px' }} onClick={(record) => handleOkDeleteAll(record)} className="status-btn-default">
                                    <span className="l-calendar-name">Có</span>
                                </Button>
                            </div>
                        </Modal>
                    </div>
            }
            <Footer></Footer>
        </>
    );
}

export default Cart;