import { Button, Table, Modal, Pagination, Slider, Tag } from 'antd';
import moment from "moment";
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import http from '../../api/http';
import { NotificationError, NotificationSuccess } from '../../common/Notification';
import LoadingSection from '../../common/LoadingSection';
import { ActChangePage } from '../../action/product';
import { RiAddLine } from 'react-icons/ri';


function ProductManager(props) {
    const dispatch = useDispatch()
    const history = useHistory()
    const auth = useSelector(state => state.auth)
    const setPage = useSelector(state => state.products)

    const { pageNumber, currentPageNumber } = setPage

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
            // render: (item) => {
            //     return (
            //         <div dangerouslySetInnerHTML={{ __html: item }} />
            //     )
            // }
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
            title: 'Số lượng',
            dataIndex: 'countInStock',
            key: 'countInStock',
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
        // {
        //     title: 'Ngày cập nhật',
        //     dataIndex: 'updatedAt',
        //     key: 'updatedAt',
        //     render: updatedAt => {
        //         return (
        //             <div>{moment(updatedAt).format('DD/MM/YYYY')}</div>
        //         )
        //     }
        // },
        {
            title: "Thao tác",
            dataIndex: '',
            key: 'action',
            render: (item) => (
                <>
                    <Button onClick={() => handleEditProduct(item)}>Sửa</Button>
                    {"  "}<Button onClick={() => handleDeleteProduct(item)}>Xóa</Button>
                </>
            )
        }
    ];
    const [dataSource, setdataSource] = useState([])
    const [loadingdata, setLoadingdata] = useState(false)

    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentProduct, setCurrentProduct] = useState("")

    const [isShowModalDelete, setIsShowModalDelete] = useState(false)


    const handleDeleteProduct = (item) => {
        setCurrentProduct(item)
        setIsShowModalDelete(true)
    }
    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false)
    }
    const handleOkDelete = async () => {
        const id = currentProduct._id;
        const url = `/products/${id}`
        const idImage = currentProduct.images.map((item => item.public_id))
        idImage.forEach((item, index) => {
            const rs = http.post("/image/destroy-image", {
                public_id: item
            })
        })
        try {
            const res = await http.delete(url)
            if (res?.status === 200) {
                NotificationSuccess("", res.data.msg)
                // fetchData(1)
                // setIsShowModalDelete(false)
            }
            if (dataSource?.length === 1) {
                if (currentPage === 2 || currentPage === 1) {
                    if (totalFilter) {
                        changePageFilter(1, null);
                        setIsShowModalDelete(false)
                        return
                    }
                    changePage(1, null);
                    setIsShowModalDelete(false)

                    return;
                } else {
                    if (totalFilter) {
                        changePageFilter(currentPage - 1, null);
                        setIsShowModalDelete(false)
                        return
                    }
                    changePage(currentPage - 1, null);
                    setIsShowModalDelete(false)
                }
                return;
            } else {
                console.log("Chưa tới ")
                if (totalFilter) {
                    changePageFilter(currentPage, null);
                    setIsShowModalDelete(false)
                    return
                }
                changePage(currentPage, null);
                setIsShowModalDelete(false)
            }

        } catch (error) {
            console.log(error)
        }
    }
    const handleEditProduct = (item) => {
        history.push(`/admin/edit-product/${item._id}`)
    }
    // Thêm mới setPage để khi về sẽ về đúng page 
    const handleSetPage = () => {
        dispatch(ActChangePage(1))
    }

    const [callBack, setCallBack] = useState(false)
    const [search, setSearch] = useState("")
    const [fillterCategory, setFilterCategory] = useState('')
    const [price, setPrice] = useState([0, 1000000])
    const [sort, setSort] = useState("")

    const fetchData = async (pageIndex) => {
        try {
            setLoadingdata(true)
            const res = await http.get(`/products?category=${fillterCategory}&sort=${sort}&keyword=${search}&price[gte]=${price[0]}&price[lte]=${price[1]}&page=${pageIndex}&limit=5`)
            // console.log(res);
            if (res?.status === 200) {
                setdataSource(res?.data?.products)
                if (fillterCategory == "") {
                    setTotalItem(res?.data?.totalItem)
                    setLoadingdata(false)
                } else {
                    setTotalFilter(res?.data?.resultFilter)
                    setCurrentPage(1);
                    setLoadingdata(false)
                }
            }
        } catch (err) {
            NotificationError("", err.msg)
        }
    }
    useEffect(() => {
        fetchData(pageNumber)
        setCurrentPage(currentPageNumber);
    }, [callBack, fillterCategory, search, price, sort])

    const typingTimeoutRef = useRef(null);
    const handleSearch = (e) => {
        const value = e.target.value
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(async () => {
            setSearch(value)

        }, 300)
    }
    const changePage = (page) => {
        localStorage.setItem("page", page)
        dispatch(ActChangePage(page))
        fetchData(page)
        setCurrentPage(page);
    }


    const [categorys, setCategorys] = useState([]);
    useEffect(() => {
        const fetChCategory = async () => {
            const rs = await http.get("/category")
            if (rs?.status === 200) {
                setCategorys(rs?.data)
            }
        }
        fetChCategory()
    }, [])

    const [totalFilter, setTotalFilter] = useState(null)
    const changePageFilter = async (page) => {
        setLoadingdata(true)
        const res = await http.get(`/products?category=${fillterCategory}&page=${page}&limit=5`)
        if (res?.status === 200) {
            setTotalFilter(res?.data?.resultFilter)
            setdataSource(res?.data?.products)
            setLoadingdata(false)
        }
        setCurrentPage(page);
    }
    const handleFilterCategory = (e) => {
        localStorage.setItem("page", 1)
        dispatch(ActChangePage(1))
        setCurrentPage(1);
        if (e.target.value === "all") {
            setFilterCategory("")
        } else {
            setFilterCategory(e.target.value)
        }
        // setCallBack(!callBack)
    }

    const typingTimeoutRefPrice = useRef(null);
    const onChangePrice = (value) => {
        if (typingTimeoutRefPrice.current) {
            clearTimeout(typingTimeoutRefPrice.current)
        }
        typingTimeoutRefPrice.current = setTimeout(async () => {
            setPrice(value)
            // setCallBack(!callBack)
        }, 300)

    }
    const handleSort = (e) => {
        localStorage.setItem("page", 1)
        dispatch(ActChangePage(1))
        setCurrentPage(1);
        setSort(e.target.value)
    }


    // Select
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [productSelecRemove, setProductSelecRemove] = useState([])
    const onSelectChange = (selectedRowKeys, item) => {
        setSelectedRowKeys(selectedRowKeys)
        setProductSelecRemove(item)
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleDeleteAll = async () => {
        try {
            const products = productSelecRemove.map((item, index) => {
                let arr;
                item.images.map((i, index) => {
                    arr = i.public_id
                })
                return arr
            })
            products.forEach(async (item, index) => {
                const rs = await http.post("/image/destroy-image", {
                    public_id: item
                })
            })

            const res = await http.post("/products/delete_all_products", {
                check: selectedRowKeys
            })
            if (res?.status === 200) {
                NotificationSuccess('', "Xóa thành công")
                setSelectedRowKeys([])
            }
            if (dataSource?.length === 1) {
                if (currentPage === 2 || currentPage === 1) {
                    changePage(1, null);
                    return;
                } else {
                    changePage(currentPage - 1, null);
                }
                return;
            } else {
                if (currentPage === 2 || currentPage === 1) {
                    changePage(1, null);
                    return;
                } else {
                    changePage(currentPage - 1, null);
                }
                changePage(currentPage)
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className="container" >
                <h2 className="title-screen">Sản phẩm</h2>
                <div className="product-managerHead">
                    <div className="product-managerFil">
                        <input type="text" onChange={handleSearch} type="text" placeholder="Tìm kiếm" />
                        <select name="" id="" onChange={handleFilterCategory}>
                            <option value="all">Phân loại</option>
                            {
                                categorys?.map((item, index) => {
                                    return (
                                        <option key={item._id} value={item._id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                        <select name="" id="" value={sort} onChange={handleSort}>
                            <option value="">Sắp xếp</option>
                            <option value="price">Giá từ thấp Tới cao</option>
                            <option value="-price">Giá từ cao Tới thấp</option>

                        </select>
                        <div className="fillter-price">
                            <h5><span>Từ: {price[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span> - <span>{price[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></h5>
                            <Slider
                                min={0}
                                max={1000000}
                                defaultValue={price}
                                onChange={onChangePrice}
                                range
                                disabled={false}
                                // tooltipVisible
                                // tipFormatter={null}
                                tipFormatter={value => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ`}
                            />
                        </div>


                    </div>
                    <button onClick={handleSetPage}><Link to="/admin/create-product" style={{ color: "#000" }}><RiAddLine size={20} /> Thêm sản phẩm</Link></button>
                </div>


                <button className={`deleteall ${selectedRowKeys.length !== 0 ? "activeDeleteAll" : ""}`} disabled={selectedRowKeys.length !== 0 ? false : true} onClick={handleDeleteAll}> Xóa tất cả</button>
                <Table
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    rowSelection={rowSelection}
                    rowKey="_id"
                    scroll={{ x: true }}
                    loading={{
                        spinning: loadingdata,
                        indicator: <LoadingSection />
                    }}
                />
                {
                    fillterCategory && <Pagination className="pagination-custom"
                        current={currentPage}
                        defaultPageSize={5}
                        // showQuickJumper
                        total={totalFilter}
                        onChange={changePageFilter}></Pagination>
                }
                {
                    fillterCategory.length === 0 && <Pagination className="pagination-custom"
                        current={currentPage}
                        defaultPageSize={5}
                        // showQuickJumper
                        total={totalItem}
                        onChange={changePage}></Pagination>
                }
                <Modal
                    className='career-type-popup'
                    title={`Bạn có chắc chắn muốn xóa sản phẩm " ${currentProduct.name} " không?"`}
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
        </>
    );
}

export default ProductManager;





