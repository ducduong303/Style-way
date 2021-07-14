import React, { useEffect, useState, useRef } from 'react';
import { Table, Modal, Button, Tabs, Tag, Pagination } from 'antd';
import http from '../api/http';
import moment from "moment";
import LoadingSection from '../common/LoadingSection';
import { NotificationError, NotificationSuccess } from '../common/Notification';
function MyOder(props) {
    const [dataSource, setDataSource] = useState([]);
    const [oderStatus, setOderStatus] = useState("")
    const [totalItem, setTotalItem] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false)
    const { TabPane } = Tabs;
    const fetchMyOder = async (pageIndex) => {
        setLoading(true)
        const res = await http.get(`/oder/me?page=${pageIndex}&oder=${search}&oderStatus=${oderStatus}&limit=5`)
        if (res?.status === 200) {
            setLoading(false)
            setDataSource(res?.data?.oders)
            setTotalItem(res?.data?.totalItem)
        }

    }
    const onChangeTabOder = (key) => {
        if (key === "1.1") {
            setOderStatus("")
            return;
        }
        if (key === "2.2") {
            setOderStatus("Đang chờ xử lý")
            return;
        }
        if (key === "3.3") {
            setOderStatus("Đã xác nhận")
            return;
        }
        if (key === "4.4") {
            setOderStatus("Đã hủy")
            return;
        }
    }
    useEffect(() => {
        fetchMyOder(1)
    }, [oderStatus, search])
    const columns = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'paymentID',
            key: 'paymentID',
            // width: 300,
            render: (paymentID) => {
                return (
                    <div>{paymentID?.slice(0, 10) + "..." + paymentID.slice(paymentID.length - 5, paymentID.length)}</div>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'oderStatus',
            key: 'oderStatus',
            sorter: (a, b) => a.oderStatus.length - b.oderStatus.length,
            render: (oderStatus) => {
                let color;
                if (oderStatus === "Đang chờ xử lý") {
                    color = "gold"
                }
                if (oderStatus === "Đã xác nhận") {
                    color = "success"
                }
                if (oderStatus === "Đã hủy") {
                    color = "error"
                }
                return (
                    <div>
                        <Tag color={color}>{oderStatus}</Tag>
                    </div>
                )
            }
        },
        {
            title: 'Phương thức',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (id, item, index) => {
                return (
                    <Tag color="error">{item.paymentMethod}</Tag>
                )
            }
        },
        {
            title: 'Đơn Giá',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (id, item, index) => {
                return (
                    <div>{item?.totalPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>đ</u></div>
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
                        <Button onClick={() => handleViewOder(item._id)}>Xem</Button>  {"  "}
                        <Button onClick={() => handleConfirm(item)} disabled={item.oderStatus === "Đã xác nhận"}>Hủy Đơn</Button>
                    </div>
                )
            }
        },
    ]


    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
    const [currentOder, setCurrentOder] = useState()
    const handleCloseModalConfirm = () => {
        setIsShowModalConfirm(false)
    }
    const handleConfirm = (item) => {
        setCurrentOder(item)
        setIsShowModalConfirm(true)
    }

    const handleOkConfirm = async () => {
        const res = await http.post(`/oder/${currentOder._id}`, {
            status: "Đã hủy"
        })
        if (res?.status === 200) {
            // console.log(res)
            handleCloseModalConfirm()
            fetchMyOder()
            NotificationSuccess("", "Hủy đơn hàng thành công")
        }
    }
    const [oderView, setOderview] = useState(null)
    const [dataOderView, setDataOderView] = useState([])
    const [loadingdata, setLoadingdata] = useState(false)

    const handleViewOder = async (id) => {
        try {
            setLoadingdata(true)
            const res = await http.get(`/oder/${id}`)
            if (res?.status === 200) {
                console.log(res)
                setLoadingdata(false)
                setOderview(res?.data)
                setDataOderView(res?.data.cart)
            }
        } catch (error) {
            console.log(error)
        }
    }

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
    const checkOderStatus = (status) => {
        let color;
        if (status === "Đang chờ xử lý") {
            color = "gold"
        }
        if (status === "Đã xác nhận") {
            color = "success"
        }
        if (status === "Đã hủy") {
            color = "error"
        }
        return (
            <Tag color={color}>{status}</Tag>
        )
    }
    const [currentPage, setCurrentPage] = useState(1);
    const changePage = (page) => {
        fetchMyOder(page)
        setCurrentPage(page);
    }

    const columnsView = [
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
            title: 'Sản phẩm',
            dataIndex: 'id',
            key: 'id',
            width: 300,
            sorter: (a, b) => a.name.length - b.name.length,
            render: (id, item, index) => {
                console.log(item)
                return (
                    <div className="oder-item">
                        <img src={item.image} alt="" style={{ width: "70px", height: "75px" }} ></img>
                        <div className="oder-desc">
                            <h4 >{item.name}</h4>
                            {
                                item?.size ? <h5>Kích thước : <Tag color="error">{item?.size}</Tag></h5> : null
                            }
                            {
                                item?.color?.name ? <h5>Màu :  <Tag color="error">{item?.color?.name}</Tag></h5> : null
                            }

                        </div>
                    </div >

                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'oderStatus',
            key: 'oderStatus',
            render: (oderStatus) => {
                let color;
                if (oderView.oderStatus === "Đang chờ xử lý") {
                    color = "gold"
                }
                if (oderView.oderStatus === "Đã xác nhận") {
                    color = "success"
                }
                if (oderView.oderStatus === "Đã hủy") {
                    color = "error"
                }
                return (
                    <div>
                        <Tag color={color}>{oderView.oderStatus}</Tag>
                    </div>
                )
            }
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            // render: (id, item, index) => {
            //     return (
            //         <div>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>đ</u></div>
            //     )
            // }
        },
        {
            title: 'Số lượng',
            dataIndex: 'count',
            key: 'count',
            render: (id, item, index) => {
                return (
                    <div>
                        {item.count}
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

    ]



    return (

        <div className="myoder">
            <div className="oder-search">
                <input type="text" placeholder="Nhập mã đơn hàng" onChange={handleSearch} />
            </div>
            <div className="oder-tab">
                <Tabs defaultActiveKey="1.1" className="tab-oder" onChange={onChangeTabOder}>
                    <TabPane tab="Tất cả đơn hàng" key="1.1">
                    </TabPane>
                    <TabPane tab="Đang chờ xử lý" key="2.2">
                    </TabPane>
                    <TabPane tab="Đã xác nhận" key="3.3">
                    </TabPane>
                    <TabPane tab="Đã hủy" key="4.4">
                    </TabPane>
                </Tabs>
            </div>
            <Table
                dataSource={dataSource}
                pagination={false}
                // pagination={{ defaultPageSize: 10, total: dataSource?.length }}
                columns={columns}
                loading={{
                    spinning: loading,
                    indicator: <LoadingSection />
                }}
                rowKey="_id"
            // title={() => <Checkbox onChange={handleCheckAll} checked={check}>{!check ? "Chọn tất cả" : "Bỏ chọn tất cả"}  </Checkbox>}
            />
            {
                search || oderStatus ? null : <Pagination className="pagination-custom"
                    current={currentPage}
                    defaultPageSize={5}
                    total={totalItem}
                    onChange={changePage}></Pagination>
            }
            <h3 className="title-oderdetail">Chi tiết đơn hàng</h3>
            {oderView ?
                <div className="viewOder">
                    <div className="oder-info mt-20 mb-5 row">
                        <div className="oder-left col-lg-8">
                            <h4>Đơn hàng: <b>{oderView?.paymentID}</b></h4>
                            <h5>Địa chỉ nhận hàng:{oderView?.paymentMethod === "Paypal" ? <>
                                {oderView?.address?.line1},{oderView?.address?.city},{oderView?.address?.country_code}
                            </>
                                :
                                <>
                                    {oderView?.address?.delivery},{oderView?.address?.wards},{oderView?.address?.district},{oderView?.address?.province}
                                </>
                            } </h5>
                            <h5>Người nhận: {oderView?.paymentMethod === "Paypal" ? (oderView?.address?.recipient_name) : (oderView?.name)}</h5>
                            <h5>Email: {oderView?.email}</h5>
                            <h5>Số điện thoại: {oderView?.address?.phone}</h5>
                            <h5>Trạng thái đơn hàng: {checkOderStatus(oderView?.oderStatus)}</h5>
                            <h5>Phương thức thanh toán: <Tag color="success">{oderView?.paymentMethod}</Tag> - <span style={{ paddingLeft: "10px" }}>{oderView?.isPaid ? <Tag color="success">Đã thanh toán</Tag> : <Tag color="error">Chưa thanh toán</Tag>}</span></h5>
                            <h5>Ngày đặt hàng: {moment(oderView?.createdAt).format('DD/MM/YYYY')}</h5>
                        </div>
                        <Table
                            style={{ margin: "20px 0" }}
                            dataSource={dataOderView}
                            pagination={false}
                            columns={columnsView}
                            // rowSelection={rowSelection}
                            rowKey="_id"
                            loading={{
                                spinning: loadingdata,
                                indicator: <LoadingSection />
                            }}
                        />

                    </div>
                </div> : null

            }
            <Modal
                className='career-type-popup'
                title={`Bạn có muốn  hủy đơn hàng  ${currentOder?.paymentID?.slice(0, 10) + "..." + currentOder?.paymentID?.slice(currentOder?.paymentID?.length - 5, currentOder?.paymentID?.length)} " không?"`}
                visible={isShowModalConfirm}
                onCancel={handleCloseModalConfirm}
            >
                <div className="career-btn">
                    <Button onClick={() => handleCloseModalConfirm()} className="status-btn-default">
                        <span className="l-calendar-name">Không</span>
                    </Button>
                    <Button style={{ marginLeft: '20px' }} onClick={(record) => handleOkConfirm(record)} className="status-btn-default">
                        <span className="l-calendar-name">Có</span>
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default MyOder;