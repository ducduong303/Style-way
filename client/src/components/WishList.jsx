import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import http from '../api/http';
import { ActGetUser } from '../action/auth';
import LoadingTable from '../common/LoadingTable';
import { NotificationSuccess } from '../common/Notification';
import Header from './Header';
import Footer from './Footer';
import TitlePage from './TitlePage';
function WishList(props) {
    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const { user } = auth
    const [loadingdata, setLoadingdata] = useState(false)
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        setLoadingdata(true)
        setDataSource(user?.wishlist)
        setLoadingdata(false)
    }, [user?.wishlist])
    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'id',
            key: 'id',
            width: 250,
            render: (id, item, index) => {
                return (
                    <div>
                        <img src={item?.images?.[0]?.url} alt="" style={{ width: "70px", height: "75px" }} ></img>
                    </div >
                )
            }

        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            render: (id, item, index) => {
                return (
                    <h4 style={{ padding: "5px" }}>{item?.name}</h4>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'countInStock',
            key: 'countInStock',
            render: (id, item, index) => {
                return (
                    <div>
                        {
                            item.countInStock > 0 ? <Tag color="success">Còn hàng</Tag> : <Tag color="error">Hết hàng</Tag>
                        }
                    </div>

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
            title: 'Thao tác',
            dataIndex: 'action',
            key: 'action',
            render: (id, item, index) => {
                return (
                    <div>
                        <Button><Link to={`/product-detail/${item._id}`}>Thêm vào giỏ hàng</Link></Button>{" "}
                        <Button onClick={() => handleRemoveWishList(item)}>Xóa</Button>
                    </div>
                )
            }
        },
    ]


    const [currentProduct, setCurrentProduct] = useState({})
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const handleRemoveWishList = (item) => {
        setCurrentProduct(item)
        setIsShowModalDelete(true)
    }
    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false)
    }
    const handleOkDelete = async () => {

        const res = await http.post(`/removeWishlist`, {
            productID: currentProduct._id
        })
        if (res?.status === 200) {
            dispatch(ActGetUser())
            setIsShowModalDelete(false)
            NotificationSuccess("", "Bạn đã xóa sản phẩm khỏi danh sách yêu thích")
        }
    }
    return (
        <>
            <Header></Header>
            <TitlePage title="Sản phẩm yêu thích"></TitlePage>
            <div className="container mt-5">
                <Table
                 scroll={{ x: true }}
                    dataSource={dataSource}
                    pagination={false}
                    // pagination={{ defaultPageSize: 10, total: dataSource?.length }}
                    columns={columns}
                    loading={{
                        spinning: loadingdata,
                        indicator: <LoadingTable />
                    }}
                    rowKey="_id"
                />
                <Modal
                    className='career-type-popup'
                    title={`Bạn có chắc chắn muốn xóa ${currentProduct.name} ra khỏi sản phẩm yêu thích ?`}
                    visible={isShowModalDelete}
                    onCancel={handleCloseModalDelete}
                >
                    <div className="career-btn">
                        <Button onClick={() => handleCloseModalDelete()} className="status-btn-default">
                            <span className="l-calendar-name">Không</span>
                        </Button>
                        <Button style={{ marginLeft: '20px' }} onClick={(record) => handleOkDelete(record)} className="status-btn-default">
                            <span className="l-calendar-name">Có</span>
                        </Button>
                    </div>
                </Modal>
            </div>
            <Footer></Footer>
        </>
    );
}

export default WishList;