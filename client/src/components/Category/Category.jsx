import { Button, Col, Form, Input, Modal, Row, Table } from 'antd';
import moment from "moment";
import React, { useEffect, useState, useRef } from 'react';
import http from '../../api/http';
import { NotificationError, NotificationSuccess } from '../../common/Notification';
import LoadingSection from '../../common/LoadingSection';
function Category(props) {
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
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
            title: 'Tên loại mặt hàng',
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
                    <Button onClick={() => handleEditCategory(item)}>Sửa</Button>
                    {"  "}<Button onClick={() => handleDeleteCategory(item)}>Xóa</Button>
                </>
            )
        }
    ]
    const [inputCategory, setInputCategory] = useState({
        id: "",
        name: "",
    })
    const handleChangeCategory = (e) => {
        setInputCategory({
            ...inputCategory,
            name: e.target.value
        })
    }
    const [visible, setVisible] = useState(false)

    const hideModal = () => {
        setVisible(false)
        setInputCategory({
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
    const fetchData = async () => {
        setLoadingdata(true)
        const res = await http.get(`/category?keyword=${search}`)
        if (res) {
            setDataSource(res.data)
            setLoadingdata(false)
        }
    }
    const onFinish = async () => {
        try {
            if (inputCategory.id === "") {
                const res = await http.post("/category", {
                    name: inputCategory.name
                })
                if (res?.status === 200) {
                    NotificationSuccess("", "Thêm mới thành công")
                }
                fetchData();
                hideModal();
            } else {
                const res = await http.put(`/category/${inputCategory.id}`, {
                    name: inputCategory.name
                })
                if (res?.status === 200) {
                    NotificationSuccess("", "Cập nhật thành công")
                }
                fetchData();
                hideModal();
            }

        } catch (error) {
            NotificationError("", error.msg)
        }

    }

    const handleEditCategory = (item) => {
        setVisible(true)
        form.setFieldsValue({
            id: item._id,
            name: item.name,
        })
        setInputCategory({
            id: item._id,
            name: item.name,
        })
    }

    const [currentCategory, setCurrentCategory] = useState({})
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false)
    }
    const handleDeleteCategory = (item) => {
        setCurrentCategory(item)
        setIsShowModalDelete(true)
    }
    const handleOk = async () => {
        try {
            const id = currentCategory._id;
            const res = await http.delete(`/category/${id}`)
            if (res?.status === 200) {
                NotificationSuccess('', "Xóa thành công")
                handleCloseModalDelete()
            } else {
                NotificationError('', "Xóa thất bại")
            };
            fetchData()
        } catch (err) {
            handleCloseModalDelete()
            NotificationError('', err.msg)

        }
    }
    const [search, setSearch] = useState("")
    useEffect(() => {
        fetchData()
    }, [search])
    const typingTimeoutRef = useRef(null);

    // const handleSearch = (e) => {
    //     const value = e.target.value
    //     if (typingTimeoutRef.current) {
    //         clearTimeout(typingTimeoutRef.current)
    //     }
    //     typingTimeoutRef.current = setTimeout(async () => {
    //         setSearch(value)
    //     }, 300)
    // }

    return (
        <div className="category container ">
            <div className="form-add ">
                <div className="flex-between mb-5">
                    {/* <input className="inputCustom" type="text" placeholder="Tìm Kiếm" onChange={handleSearch} /> */}
                    <button className="btn-add" onClick={() => setVisible(true)}>Thêm mới</button>
                </div>


                <Table
                 scroll={{ x: true }}
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    // rowSelection={rowSelection}
                    rowKey="_id"
                    // loading={loadingdata}
                    loading={{
                        spinning: loadingdata,
                        indicator: <LoadingSection />
                    }}

                />
                <Modal
                    title={inputCategory.id ? "Cập nhật" : "Thêm mới"}
                    visible={visible}
                    onOk={hideModal}
                    onCancel={hideModal}
                    okText="Ok"
                    cancelText="Trờ lại"
                    footer={
                        [
                            <Button onClick={hideModal}>Trở về</Button>,
                            <Button onClick={handleSubmit}> {inputCategory.id ? "Cập nhật" : "Thêm mới"}</Button>
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
                                    label="Tên loại:"
                                    name="name"
                                    style={{ textAlign: "left" }}
                                    value={inputCategory.name}
                                    onChange={handleChangeCategory}
                                    rules={[{ required: true, message: 'Vui lòng nhập tên Category!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    className='career-type-popup'
                    title={`Bạn có chắc chắn muốn xóa Category " ${currentCategory.name} " không ?`}
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

export default Category;