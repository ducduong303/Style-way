import { Table, Tag, Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import http from '../../api/http';
import LoadingTable from '../../common/LoadingTable';
import moment from "moment";
import { Link } from 'react-router-dom';
import { BiArrowBack } from 'react-icons/bi';
function OderDetail(props) {
    const { match } = props;
    const id = match.params.id

    const [oderDetail, setOderDetail] = useState()
    const [dataSource, setDataSource] = useState([]);
    const [loadingdata, setLoadingdata] = useState(false)

    const columns = [
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
                return (
                    // <div>{index + 1}</div>
                    <div className="oder-item">
                        <img src={item.image} alt="" style={{ width: "70px", height: "75px" }} ></img>
                        <div className="oder-desc">
                            <h4 >{item.name}</h4>
                            <h5>Kích thước : <Tag color="error">{item?.size}</Tag></h5>
                            <h5>Màu :  <Tag color="error">{item?.color?.name}</Tag></h5>
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
                if (oderDetail.oderStatus === "Đang chờ xử lý") {
                    color = "gold"
                }
                if (oderDetail.oderStatus === "Đã xác nhận") {
                    color = "success"
                }
                if (oderDetail.oderStatus === "Đã hủy") {
                    color = "error"
                }
                return (
                    <div>
                        <Tag color={color}>{oderDetail.oderStatus}</Tag>
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
                    <div>{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>đ</u></div>
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

    const fetChOderDetail = async () => {
        try {
            setLoadingdata(true)
            const res = await http.get(`/oder/${id}`)
            if (res?.status === 200) {
                // console.log(res)
                setLoadingdata(false)
                setOderDetail(res?.data)
                setDataSource(res?.data.cart)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetChOderDetail()
    }, [id])

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


    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
    const [type, setType] = useState("")
    // const [currentOder, setCurrentOder] = useState(null)
    const handleCloseModalConfirm = () => {
        setIsShowModalConfirm(false)
    }
    const handleConfirm = (type) => {
        setType(type)
        setIsShowModalConfirm(true)
    }

    const handleOkConfirm = async () => {
        let status = type === '1' ? "Đã xác nhận" : "Đã hủy"
        const res = await http.put(`/oder/${id}`, {
            status: status
        })
        if (res?.status === 200) {
            // console.log(res)
            handleCloseModalConfirm()
            fetChOderDetail()
        }

    }

    return (
        <div className='container oder-detail mt-2'>
            <div className="container">
                <h2 className="title-screen"><Link to="/admin/oder-manager"><BiArrowBack size={20} /></Link>Chi tiết đơn hàng</h2>
                <div className="oder-info mt-20 mb-5 row">
                    <div className="oder-left col-lg-8">
                        <h4>Đơn hàng: <b>{oderDetail?.paymentID}</b></h4>
                        <h5>Địa chỉ nhận hàng:{oderDetail?.paymentMethod === "Paypal" ? <>
                            {oderDetail?.address?.line1},{oderDetail?.address?.city},{oderDetail?.address?.country_code}
                        </>
                            :
                            <>
                                {oderDetail?.address?.delivery},{oderDetail?.address?.wards},{oderDetail?.address?.district},{oderDetail?.address?.province}
                            </>
                        } </h5>
                        <h5>Người nhận: {oderDetail?.paymentMethod === "Paypal" ? (oderDetail?.address?.recipient_name) : (oderDetail?.name)}</h5>
                        <h5>Email: {oderDetail?.email}</h5>
                        <h5>Số điện thoại: {oderDetail?.address?.phone ? oderDetail?.address?.phone : "chưa cập nhật"}</h5>
                        <h5>Trạng thái đơn hàng: {checkOderStatus(oderDetail?.oderStatus)}</h5>
                        <h5>Phương thức thanh toán: <Tag color="success">{oderDetail?.paymentMethod}</Tag> - <span style={{ paddingLeft: "10px" }}>{oderDetail?.isPaid ? <Tag color="success">Đã thanh toán</Tag> : <Tag color="error">Chưa thanh toán</Tag>}</span></h5>
                        <h5>Ngày đặt hàng: {moment(oderDetail?.createdAt).format('DD/MM/YYYY')}</h5>
                    </div>
                    <div className="oder-rigth col-lg-4">
                        <Button disabled={oderDetail?.oderStatus === "Đã hủy"} onClick={() => handleConfirm("1")}>Xác nhận</Button>
                        <Button disabled={oderDetail?.oderStatus === "Đã xác nhận"} onClick={() => handleConfirm("2")}>Hủy đơn hàng</Button>
                    </div>
                </div>
                <br />
                <Table
                    scroll={{ x: true }}
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    // rowSelection={rowSelection}
                    rowKey="_id"
                    loading={{
                        spinning: loadingdata,
                        indicator: <LoadingTable />
                    }}
                />
                <Modal
                    className='career-type-popup'
                    title={`Bạn có muốn ${type === "1" ? "xác nhận" : "hủy"} đơn hàng  ${oderDetail?.paymentID?.slice(0, 10) + "..." + oderDetail?.paymentID?.slice(oderDetail?.paymentID?.length - 5, oderDetail?.paymentID?.length)} " không?"`}
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
        </div>
    );
}

export default OderDetail;