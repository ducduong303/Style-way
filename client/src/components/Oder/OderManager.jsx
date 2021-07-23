import { Button, Pagination, Table, Tabs, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../../api/http';
import Modal from 'antd/lib/modal/Modal';
import { NotificationSuccess, NotificationError } from '../../common/Notification';
import LoadingSection from '../../common/LoadingSection';
import { saveAs } from 'file-saver';
const ExcelJS = require('exceljs');
const { TabPane } = Tabs;
function OderManager(props) {

    // handle In Excel
    let myHeader = ["STT", "Mã đơn hàng", "Người đặt hàng", "Email", "Địa chỉ", "Số điện thoái",
        "Trạng thái đơn hàng", "Phương thức thanh toán", "SL sản phẩm", "Tổng tiền"
    ]
    const getdataExcel = () => {
        if (dataSource.length === 0) {
            NotificationError("", "Hiện tại chưa có đơn hàng nào")
            return
        }
        let mydataExcel = dataSource?.map((item, index) => {
            return {
                STT: index + 1,
                OderCode: item.paymentID,
                NguoidatHang: item.name,
                Email: item.email,
                Diachi: item.paymentMethod === "Paypal" ? (item.address.line1 + item.address.city) : (item.address.delivery + item.address.wards + item.address.district + item.address.province),
                Sodienthoai: item.address.phone,
                Trangthai: item.oderStatus,
                PhuongthucTT: item.paymentMethod,
                SoLuongSP: item.cart.length,
                Tổng: item.totalPrice
            }

        })
        console.log(mydataExcel)
        return mydataExcel
    }


    const addRow = (ws, data, section) => {
        const borderStyle = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            rigth: { style: "thin" },
        }

        const row = ws.addRow(data)
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (section?.border) {
                cell.border = borderStyle
            }
            if (section?.money && typeof cell.value === "number") {
                cell.alignment = { horizontal: "rigth", vertical: "middle" }
                cell.numFmt = `$#,#00.00;[Red]-$#,###.00`;
            }
            if (section?.alignment) {
                cell.alignment = section.alignment
            } else {
                cell.alignment = { vertical: "middle" }
            }
            if (section?.font) {
                cell.font = section.font
            }
            if (section?.fill) {
                cell.fill = section.fill;
            }
        })
        if (section?.height > 0) {
            row.height = section.height
        }
        return row
    }

    const exportToEcelPro = async (myData, fileName, sheetName, report, myHeader, widths) => {
        if (!myData) return;
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet(sheetName)
        const columns = myHeader.length
        const title = {
            border: true,
            money: false,
            height: 25,
            font: { size: 14, bold: false, color: { argb: '000000' } },
            alignment: { horizontal: "center", vertical: "middle" },
            // fill: {
            //     type: "pattern",
            //     pattern: "solid",
            //     fgColor: {
            //         argb: "0000FF"
            //     }
            // }
        }
        const header = {
            border: true,
            money: false,
            height: 20,
            font: { size: 14, bold: false, color: { argb: '000000' } },
            alignment: { horizontal: "center", vertical: "middle" },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: "FFFFFF"
                }
            }
        }
        const data = {
            border: true,
            money: false,
            height: 20,
            font: { size: 13, bold: false, color: { argb: '000000' } },
            alignment: { horizontal: "center", vertical: "middle" },
            fill: null
        }
        // const footer = {
        //     border: true,
        //     money: false,
        //     height: 20,
        //     font: { size: 13, bold: false, color: { argb: '000000' } },
        //     alignment: { horizontal: "center", vertical: "middle" },
        //     // fill: {
        //     //     type: "pattern",
        //     //     pattern: "solid",
        //     //     fgColor: {
        //     //         argb: "000000"
        //     //     }
        //     // }
        // }
        if (widths && widths.length > 0) {
            ws.columns = widths
        }

        let row = addRow(ws, [report], title)
        mergeCells(ws, row, 1, columns)
        addRow(ws, myHeader, header)
        myData.forEach((item, index) => {
            addRow(ws, Object.values(item), data)
        })

        // row = addRow(ws, myFooter, footer)
        // mergeCells(ws, row, 1, columns - 1);
        const buf = await wb.xlsx.writeBuffer()
        saveAs(new Blob([buf]), `${fileName}.xlsx`)
    }

    const mergeCells = (ws, row, from, to) => {
        ws.mergeCells(`${row.getCell(from)._address}:${row.getCell(to)._address}`)
    }
    const handleExportExcel = () => {
        const myData = getdataExcel()

        exportToEcelPro(
            myData, "danh sách đơn hàng", "oder", "Danh sách đơn hàng", myHeader,
            [
                { width: 10 },
                { width: 40 },
                { width: 30 },
                { width: 30 },
                { width: 60 },
                { width: 20 },
                { width: 30 },
                { width: 40 },
                { width: 20 },
                { width: 20 },
            ]

        )
    }




    const [loadingdata, setLoadingdata] = useState(false)
    const [dataSource, setDataSource] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [oderStatus, setOderStatus] = useState("")
    const [payStatus, setPayStatus] = useState("")
    const fetchOderList = async (pageIndex) => {
        try {
            setLoadingdata(true)
            const res = await http.get(`/oder?page=${pageIndex}&limit=5&oder=${search}&oderStatus=${oderStatus}&payStatus=${payStatus}`)
            if (res?.status === 200) {
                setLoadingdata(false)
                setDataSource(res.data.oders)
                setTotalItem(res?.data?.totalItem)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchOderList(1)
    }, [search, oderStatus, payStatus])
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
            title: 'Mã đơn hàng',
            dataIndex: 'paymentID',
            key: 'paymentID',
            render: (paymentID) => {
                return (
                    <div>{paymentID.slice(0, 10) + "..." + paymentID.slice(paymentID.length - 5, paymentID.length)}</div>
                )
            }
        },
        // {
        //     title: 'Người đặt hàng',
        //     dataIndex: 'email',
        //     key: 'email',
        // },
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
            title: 'Phương Thức TT',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Đã thanh toán',
            dataIndex: 'isPaid',
            key: 'isPaid',
            sorter: (a, b) => a.isPaid - b.isPaid,
            render: (isPaid) => {
                return (
                    <div>{isPaid ? <Tag color="success">Đã thanh toán</Tag> : <Tag color="error">Chưa thanh toán</Tag>}</div>
                )
            }
        },
        {
            title: 'Đơn giá',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            render: (totalPrice) => {
                return (
                    <div>{totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}<u>đ</u></div>
                )
            }
        },
        {
            title: "Thao tác",
            dataIndex: '',
            key: 'action',
            render: (item) => (
                <>
                    <Button><Link to={`/admin/oder-manager/${item._id}`}>Xem</Link></Button>{" "}
                    <Button onClick={() => handleDeleteOder(item)}>Xóa</Button>
                </>
            )
        }
    ]

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
        fetchOderList(page)
        setCurrentPage(page);
    }

    const handleFilterOder = (e) => {
        setOderStatus(e.target.value)
        setCurrentPage(1);
    }

    const handleFilterPay = (e) => {
        setPayStatus(e.target.value)
        setCurrentPage(1);
    }

    // Select
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    // const [productSelecRemove, setProductSelecRemove] = useState([])
    const onSelectChange = (selectedRowKeys, item) => {
        setSelectedRowKeys(selectedRowKeys)
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    const onChangeTab = async (key) => {
        if (key === "1") {
            setOderStatus("")
            return;
        }
        if (key === "2") {
            setOderStatus("Đang chờ xử lý")
            return;
        }
        if (key === "3") {
            setOderStatus("Đã xác nhận")
            return;
        }
        if (key === "4") {
            setOderStatus("Đã hủy")
            return;
        }
    }

    // handle Xoa'
    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false)
    const handleCloseModalConfirm = () => {
        setIsShowModalConfirm(false)
    }
    const [currentOder, setCurrentOder] = useState(null)
    const handleDeleteOder = (oder) => {
        setCurrentOder(oder)
        setIsShowModalConfirm(true)
    }
    const handleOkConfirm = async () => {
        const res = await http.delete(`/oder/${currentOder._id}`)
        if (res?.status === 200) {
            NotificationSuccess('', "Xóa thành công")
        }
        if (dataSource?.length === 1) {
            if (currentPage === 2 || currentPage === 1) {
                changePage(1, null);
                setIsShowModalConfirm(false)
                return;
            } else {
                changePage(currentPage - 1, null);
                setIsShowModalConfirm(false)
            }
            return;
        } else {
            changePage(currentPage, null);
            setIsShowModalConfirm(false)
        }
        fetchOderList(currentPage)
    }

    const handleDeleteAll = async () => {

        // console.log("selectedRowKeys", selectedRowKeys)

        try {
            const res = await http.post("/oder/delete_all", {
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
        <div className="container mt-2">
            <h2 className="title-screen">Danh sách đơn hàng</h2>
            <div className="oder-head">
                <input type="text" className="inputCustom" placeholder="Tìm kiếm đơn hàng" onChange={handleSearch} />
                <select name="" id="" className="inputCustom" onChange={handleFilterOder}>
                    <option value="">Trạng thái đơn hàng</option>
                    <option value="Đang chờ xử lý">Đang chờ xử lý</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đã hủy">Đã hủy</option>
                </select>
                <select name="" id="" className="inputCustom" onChange={handleFilterPay}>
                    <option value="">Trạng thái thanh toán</option>
                    <option value={true}>Đã thanh toán</option>
                    <option value={false}>Chưa thanh toán</option>
                </select>
                <button className="btn-removes" style={{ margin: 0 }} onClick={handleExportExcel}>In Excel</button>
            </div>
            <button className="btn-removes" disabled={selectedRowKeys.length !== 0 ? false : true} onClick={handleDeleteAll}>Xóa tất cả</button>

            <div className="oder-tab">
                <Tabs defaultActiveKey="1" onChange={onChangeTab}>
                    <TabPane tab="Tất cả đơn hàng" key="1">
                    </TabPane>
                    <TabPane tab="Đang chờ xử lý" key="2">
                    </TabPane>
                    <TabPane tab="Đã xác nhận" key="3">
                    </TabPane>
                    <TabPane tab="Đã hủy" key="4">
                    </TabPane>
                </Tabs>
            </div>

            <Table
                dataSource={dataSource}
                pagination={false}
                columns={columns}
                rowSelection={rowSelection}
                scroll={{ x: true }}
                rowKey="_id"
                loading={{
                    spinning: loadingdata,
                    indicator: <LoadingSection />
                }}
            />
            {
                search || oderStatus || payStatus ? null : <Pagination className="pagination-custom"
                    current={currentPage}
                    defaultPageSize={5}
                    total={totalItem}
                    onChange={changePage}></Pagination>
            }
            <Modal
                className='career-type-popup'
                title={`Bạn có muốn xóa đơn hàng  ${currentOder?.paymentID?.slice(0, 10) + "..." + currentOder?.paymentID?.slice(currentOder?.paymentID?.length - 5, currentOder?.paymentID?.length)} " không?"`}
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

export default OderManager;