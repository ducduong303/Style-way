import { Button, Col, Form, Input, Modal, Row, Table, Pagination } from 'antd';
import moment from "moment";
import React, { useEffect, useState, useRef } from 'react';
import http from '../../api/http';
import { NotificationError, NotificationSuccess } from '../../common/Notification';
import { rgbToHex } from '../../utils/rgbToHex';
import { hexToRGB } from '../../utils/hexToRGB';
import { RiAddLine } from 'react-icons/ri';
import LoadingSection from '../../common/LoadingSection';


function Colors(props) {
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    const [visible, setVisible] = useState(false)
    const [loadingdata, setLoadingdata] = useState(false)
    const [dataSource, setDataSource] = useState([]);
    const [inputColor, setInputColor] = useState({
        id: "",
        name: "",
        color: ""
    })


    const handleChangeInput = (e, type) => {
        if (type === "color") {
            const color = hexToRGB(e.target.value)
            setInputColor({
                ...inputColor,
                [type]: e.target.value,
                color: color
            })

        } else {
            setInputColor({
                ...inputColor,
                [type]: e.target.value
            })
        }

    }
    const hideModal = () => {
        setVisible(false)
        setInputColor({
            id: "",
            name: "",
            color: ""
        })
        form.resetFields();
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        form.validateFields()
            .then((values) => {
                onFinish()
            }).catch((info) => {
                console.log('Validate Failed:');
            });
    }
    const onFinish = async () => {
        try {
            if (inputColor.id === "") {
                const res = await http.post("/color", {
                    name: inputColor.name,
                    color: inputColor.color
                })
                if (res?.status === 200) {
                    NotificationSuccess("", "Thêm mới thành công")
                }
                fetchData(1);
                setCurrentPage(1)
                hideModal();
            } else {
                const res = await http.put(`/color/${inputColor.id}`, {
                    name: inputColor.name,
                    color: inputColor.color
                })
                if (res?.status === 200) {
                    NotificationSuccess("", "Cập nhật thành công")
                }
                fetchData(currentPage);
                hideModal();
            }

        } catch (error) {
            NotificationError("", error.msg)
        }

    }


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
            title: 'Tên màu',
            dataIndex: 'name',
            key: 'name',
            // sorter: true,
            sorter: (a, b) => a.name.length - b.name.length,
            render: (id, item, index) => {
                return (
                    <div style={{ textTransform: 'capitalize' }}>{item.name}</div>
                )
            }
        },
        {
            title: 'Kiểu màu',
            dataIndex: 'color',
            key: 'color',
            // sorter: true,
            render: (id, item, index) => {
                return (
                    <div style={{ backgroundColor: item.color, borderRadius: "5px", height: "30px", width: "30px", border: "2px solid #bdc3c7" }}></div>

                )
            }
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
        {
            title: "Thao tác",
            dataIndex: '',
            key: 'action',
            render: (item) => (
                <>
                    <Button onClick={() => handleEditColor(item)}>Sửa</Button>
                    {"  "}<Button onClick={() => handleDeleteColor(item)}>Xóa</Button>
                </>
            )
        }
    ]

    const handleEditColor = (item) => {
        setVisible(true)
        form.setFieldsValue({
            id: item._id,
            name: item.name,
            color: rgbToHex(item.color)
        })
        setInputColor({
            id: item._id,
            name: item.name,
            color: rgbToHex(item.color)
        })
    }
    const [currentColor, setCurrentColor] = useState({})
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false)
    }
    const handleDeleteColor = (item) => {
        setCurrentColor(item)
        setIsShowModalDelete(true)
    }

    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("")
    const fetchData = async (pageIndex) => {
        setLoadingdata(true)
        const res = await http.get(`/color?keyword=${search}&page=${pageIndex}&limit=5`)
        if (res) {
            setDataSource(res?.data?.colors)
            setTotalItem(res?.data.totalItem)
            setLoadingdata(false)
        }
    }

    const handleOk = async () => {
        const id = currentColor._id;
        try {
            const res = await http.delete(`/color/${id}`)
            if (res?.status === 200) {
                NotificationSuccess('', "Xóa thành công")
                handleCloseModalDelete()
            }
            fetchData()
        } catch (error) {
            handleCloseModalDelete()
            NotificationError("", error.msg)
        }
    }

    const handleDeleteAll = async () => {
        try {
            const res = await http.post("/color/delete_all_color", {
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
    useEffect(() => {
        fetchData(1)
    }, [search])
    const changePage = (page) => {
        fetchData(page)
        setCurrentPage(page);
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
    // SelecAll
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const onSelectChange = (selectedRowKeys, item) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys, item);
        setSelectedRowKeys(selectedRowKeys)
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    return (
        <div className="color container">
            <h2 className="title-screen">Màu sắc</h2>
            <div className="form-add ">
                <div className="flex-between">
                    <input className="inputCustom" type="text" placeholder="Tìm Kiếm" onChange={handleSearch} />
                    <button className="btn-add" onClick={() => setVisible(true)}><RiAddLine size={20} />Thêm mới</button>
                </div>
                <button className="btn-removes" disabled={selectedRowKeys.length !== 0 ? false : true} onClick={handleDeleteAll}>Xóa tất cả</button>
                <Table
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    rowSelection={rowSelection}
                    rowKey="_id"
                    // loading={loadingdata}
                    loading={{
                        spinning: loadingdata,
                        indicator: <LoadingSection />
                    }}

                />
                {
                    !search && <Pagination className="pagination-custom"
                        current={currentPage}
                        defaultPageSize={5}
                        total={totalItem}
                        onChange={changePage}></Pagination>
                }
                <Modal
                    title={inputColor.id ? "Cập nhật" : "Thêm mới"}
                    visible={visible}
                    onOk={hideModal}
                    onCancel={hideModal}
                    okText="Ok"
                    cancelText="Trờ lại"
                    footer={
                        [
                            <Button onClick={hideModal}>Trở về</Button>,
                            <Button onClick={handleSubmit}> {inputColor.id ? "Cập nhật" : "Thêm mới"}</Button>
                        ]
                    }
                >
                    <Row justify="center">
                        <Col span={24}>
                            <Form
                                {...layout}
                                name="basic"
                                form={form}
                            >
                                <Form.Item
                                    label="Tên màu"
                                    name="name"
                                    style={{ textAlign: "left" }}
                                    value={inputColor.name}
                                    onChange={(_) => handleChangeInput(_, "name")}
                                    rules={[{ required: true, message: 'Vui lòng nhập tên Màu!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label="Màu"
                                    name="color"
                                    style={{ textAlign: "left" }}
                                    value={inputColor.color}
                                    onChange={(_) => handleChangeInput(_, "color")}
                                    rules={[{ required: true, message: 'Vui lòng nhập tên Màu!' }]}
                                >
                                    <Input type="color" />
                                </Form.Item>

                            </Form>
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    className='career-type-popup'
                    title={`Bạn có chắc chắn muốn xóa Màu " ${currentColor.name} " không ?`}
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
            </div>
        </div>
    );
}

export default Colors;