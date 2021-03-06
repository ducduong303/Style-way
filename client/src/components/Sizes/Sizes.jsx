import { Button, Col, Form, Input, Modal, Pagination, Row, Table } from 'antd';
import moment from "moment";
import React, { useEffect, useRef, useState } from 'react';
import { RiAddLine } from 'react-icons/ri';
import http from '../../api/http';
import { NotificationError, NotificationSuccess } from '../../common/Notification';
import LoadingSection from '../../common/LoadingSection';
function Sizes(props) {
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    const [visible, setVisible] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [search, setSearch] = useState("")

    const [inputSize, setInputSize] = useState({
        id: "",
        name: "",
    })
    const handleChangeSize = (e) => {
        setInputSize({
            ...inputSize,
            name: e.target.value.toUpperCase()
        })
    }
    const hideModal = () => {
        setVisible(false)
        setInputSize({
            id: "",
            name: "",
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
            if (inputSize.id === "") {
                const res = await http.post("/size", {
                    name: inputSize.name
                })
                if (res?.status === 200) {
                    NotificationSuccess("", "Thêm mới thành công")
                }
                fetchData(1);
                setCurrentPage(1)
                hideModal();
            } else {
                const res = await http.put(`/size/${inputSize.id}`, {
                    name: inputSize.name
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



    const [loadingdata, setLoadingdata] = useState(false)
    const [dataSource, setDataSource] = useState([]);
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
            title: 'Tên size',
            dataIndex: 'name',
            key: 'name',
            // sorter: true,
            sorter: (a, b) => a.name.length - b.name.length,
            render: (id, item, index) => {
                return (
                    <div>{item.name}</div>
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
                    <Button onClick={() => handleEditSize(item)}>Sửa</Button>
                    {"  "}<Button onClick={() => handleDeleteSize(item)}>Xóa</Button>
                </>
            )
        }
    ]

    const handleEditSize = (item) => {
        setVisible(true)
        form.setFieldsValue({
            id: item._id,
            name: item.name,
        })
        setInputSize({
            id: item._id,
            name: item.name,
        })
    }


    const [currentSize, setCurrentSize] = useState({})
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false)
    }
    const handleDeleteSize = (item) => {
        setCurrentSize(item)
        setIsShowModalDelete(true)
    }

    const handleOk = async () => {
        const id = currentSize._id;
        try {
            const res = await http.delete(`/size/${id}`)
            if (res?.status === 200) {
                NotificationSuccess('', "Xóa thành công")
                // handleCloseModalDelete()
            }
            if (dataSource?.length === 1) {
                if (currentPage === 2 || currentPage === 1) {
                    changePage(1, null);
                    setIsShowModalDelete(false)
                    return;
                } else {
                    changePage(currentPage - 1, null);
                    setIsShowModalDelete(false)
                }
                return;
            } else {
                changePage(currentPage, null);
                setIsShowModalDelete(false)
            }
            fetchData(currentPage)
        } catch (error) {
            handleCloseModalDelete()
            NotificationError("", error.msg)
        }

    }
    const [totalItem, setTotalItem] = useState(0);
    const [sort, setSort] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const fetchData = async (pageIndex) => {
        setLoadingdata(true)
        const res = await http.get(`/size?sort=${sort}&keyword=${search}&page=${pageIndex}&limit=5`)
        if (res) {
            setDataSource(res?.data?.sizes)
            setTotalItem(res?.data.totalItem)
            setLoadingdata(false)
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


    const handleDeleteAll = async () => {
        try {
            const res = await http.post("/size/delete_all_size", {
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

    // onSelecAll
    const onSelectChange = (selectedRowKeys, item) => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys, item);
        setSelectedRowKeys(selectedRowKeys)
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (
        <div className="size container">
            <h2 className="title-screen">Kích cỡ</h2>
            <div className="form-add ">
                <div className="flex-between mb-5">
                    <input className="inputCustom" type="text" placeholder="Tìm Kiếm" onChange={handleSearch} />
                    <button className="btn-add" onClick={() => setVisible(true)}><RiAddLine size={20} />Thêm mới</button>
                </div>

                <button className="btn-removes" disabled={selectedRowKeys.length !== 0 ? false : true} onClick={handleDeleteAll}> Xóa tất cả</button>

                <Table
                    dataSource={dataSource}
                    pagination={false}
                    scroll={{ x: true }}
                    columns={columns}
                    rowSelection={rowSelection}
                    rowKey="_id"
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
                    title={inputSize.id ? "Cập nhật" : "Thêm mới"}
                    visible={visible}
                    onOk={hideModal}
                    onCancel={hideModal}
                    okText="Ok"
                    cancelText="Trờ lại"
                    footer={
                        [
                            <Button onClick={hideModal}>Trở về</Button>,
                            <Button onClick={handleSubmit}> {inputSize.id ? "Cập nhật" : "Thêm mới"}</Button>
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
                                    label="Tên Size"
                                    name="name"
                                    style={{ textAlign: "left" }}
                                    value={inputSize.name}
                                    onChange={handleChangeSize}
                                    rules={[{ required: true, message: 'Vui lòng nhập tên Size!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    className='career-type-popup'
                    title={`Bạn có chắc chắn muốn xóa Size " ${currentSize.name} " không ?`}
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

export default Sizes;