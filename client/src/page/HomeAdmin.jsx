import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Pagination, Slider, Tag } from 'antd';
import { FaRegUser } from 'react-icons/fa';
import { FiBox } from 'react-icons/fi';
import { CgShoppingCart, CgNotes } from 'react-icons/cg';
import http from "../api/http"
import moment from "moment";
import LoadingSection from '../common/LoadingSection';
function HomeAdmin(props) {

    const [userList, setUserList] = useState(null)
    const [productList, setProductList] = useState(null)
    const [oderList, setOderList] = useState(null)
    const [blogList, setBlogList] = useState(null)


    const fetchUserList = async () => {
        try {
            const res = await http.get(`/all_user?page=1&limit=5`)
            if (res?.status === 200) {
                setUserList(res?.data)
            }
        } catch (error) {
            console.log(error);

        }
    }
    const [loadingPr, setLoadingPr] = useState(false)
    const fetchProductList = async () => {
        try {
            setLoadingPr(true)
            const res = await http.get(`/products?sort=-rating&page=1&limit=5`)
            if (res?.status === 200) {
                setLoadingPr(false)
                setProductList(res?.data)
            }
        } catch (error) {
            console.log(error);

        }
    }
    const fetchOdertList = async () => {
        try {
            const res = await http.get(`/oder?page=1&limit=5`)
            if (res?.status === 200) {
                setOderList(res?.data)
            }
        } catch (error) {
            console.log(error);

        }
    }

    const [loadingBlog,setLoadingBlog] = useState(false)
    const fetchBlogList = async () => {
        try {
            setLoadingBlog(true)
            const res = await http.get(`/blog?page=1&limit=5`)
            if (res?.status === 200) {
                setLoadingBlog(false)
                setBlogList(res?.data)
            }
        } catch (error) {
            console.log(error);

        }
    }

    const [productSelling, setProductSelling] = useState(null)
    const [loadingSel, setLoadingSel] = useState(false)
    const fetchProductSelling = async () => {
        try {
            setLoadingSel(true)
            const res = await http.get(`/products?sort=-sold&page=1&limit=5`)
            if (res?.status === 200) {
                setLoadingSel(false)
                setProductSelling(res?.data?.products)
                // console.log(res);

            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchUserList()
        fetchProductList()
        fetchOdertList()
        fetchBlogList()
        fetchProductSelling()
    }, [])



    const columns = [
        {
            title: 'STT',
            dataIndex: '_id',
            key: '_id',
            render: (id, item, index) => {
                return (
                    <div>{index + 1}</div>
                )
            },
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'images',
            key: 'images',
            render: (id, item, index) => {
                return (
                    <img style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }} src={item.images[0].url} alt="img"></img>
                )
            },
        },
        {
            title: 'Giá sản phẩm',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            render: (item) => {
                return (
                    <div>{item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                )
            }
        },
        {
            title: 'Đã bán',
            dataIndex: 'sold',
            key: 'sold',
            render: (id, item, index) => {
                return (
                    <div>{item.sold}</div>
                )
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (id, item, index) => {
                return (
                    <div>{item.countInStock > 0 ? <Tag color="success">Còn hàng</Tag> : <Tag color="error">Hết hàng</Tag>}</div>
                )
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: createdAt => {
                return (
                    <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
                )
            }
        },
    ];

    const columnsBlog = [
        {
            title: 'STT',
            dataIndex: '_id',
            key: '_id',
            render: (id, item, index) => {
                return (
                    <div>{index + 1}</div>
                )
            }

        },
        {
            title: 'Tên bài viết',
            dataIndex: 'hastag',
            key: 'hastag',

        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: createdAt => {
                return (
                    <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
                )
            }
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: updatedAt => {
                return (
                    <div>{moment(updatedAt).format('DD/MM/YYYY')}</div>
                )
            }
        },
    ]
    return (
        <div className="home-admin">
            <div className="container">
                <div className="admin-statistical row">
                    <div className="col-lg-3">
                        <div className="statistical-item">
                            <div className="statistical-box">
                                <div className="statistical-left">
                                    <div className="statistical-icon one">
                                        <FaRegUser size={18} />
                                    </div>
                                    <h4>Người dùng</h4>
                                </div>
                                <div className="statistical-right ">
                                    <h3>Số lượng</h3>
                                    <h4>{userList?.totalItem}</h4>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="statistical-item">
                            <div className="statistical-box">
                                <div className="statistical-left">
                                    <div className="statistical-icon two">
                                        <FiBox size={20}></FiBox>
                                    </div>
                                    <h4>Sản phẩm</h4>
                                </div>
                                <div className="statistical-right">
                                    <h3>Số lượng</h3>
                                    <h4>{productList?.totalItem}</h4>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="statistical-item">
                            <div className="statistical-box">
                                <div className="statistical-left">
                                    <div className="statistical-icon three">
                                        <CgShoppingCart size={20} />
                                    </div>

                                    <h4>Đơn hàng</h4>
                                </div>
                                <div className="statistical-right">
                                    <h3>Số lượng</h3>
                                    <h4>{oderList?.totalItem}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="statistical-item">
                            <div className="statistical-box">
                                <div className="statistical-left">
                                    <div className="statistical-icon for">
                                        <CgNotes size={18} />
                                    </div>
                                    <h4>Bài viết</h4>
                                </div>
                                <div className="statistical-right">
                                    <h3>Số lượng</h3>
                                    <h4>{blogList?.totalItem}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="statistical-product  row">
                    <div className="statistical-productFavorite col-lg-12 mb-5">
                        <h3 className="mb-3">Sản phẩm yêu thích nhất</h3>
                        <Table
                            dataSource={productList?.products}
                            pagination={false}
                            columns={columns}
                            // rowSelection={rowSelection}
                            rowKey="_id"
                            // scroll={{ x: 768 }}
                            loading={{
                                spinning: loadingPr,
                                indicator: <LoadingSection />
                            }}
                        />
                    </div>
                    <div className="statistical-productSelling col-lg-12 mb-5">
                        <h3 className="mb-3">Sản phẩm bán chạy nhất</h3>
                        <Table
                            dataSource={productSelling}
                            pagination={false}
                            columns={columns}
                            // rowSelection={rowSelection}
                            rowKey="_id"
                            // scroll={{ x: 768 }}
                            loading={{
                                spinning: loadingSel,
                                indicator: <LoadingSection />
                            }}
                        />
                    </div>
                    <div className="statistical-productSelling col-lg-12 mb-5">
                        <h3 className="mb-3">Bài viết mới nhất</h3>
                        <Table
                            dataSource={blogList?.blogs}
                            pagination={false}
                            columns={columnsBlog}
                            // rowSelection={rowSelection}
                            rowKey="_id"
                            // scroll={{ x: 768 }}
                            loading={{
                                spinning: loadingBlog,
                                indicator: <LoadingSection />
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;