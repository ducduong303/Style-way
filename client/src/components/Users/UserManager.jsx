import { Button, Checkbox, Col, Form, Input, Modal, Pagination, Row, Table, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { RiAddLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import http from '../../api/http';
import Loading from '../../common/Loading';
import { NotificationError, NotificationSuccess } from '../../common/Notification';
import LoadingSection from '../../common/LoadingSection';

function UserManager(props) {
    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const { user, isAdmin } = auth
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
    };

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
            title: 'Tên người dùng',
            dataIndex: 'name',
            key: 'name',
            // sorter: true,
            sorter: (a, b) => a.name.length - b.name.length,
            render: (id, item, index) => {
                return (
                    <div><img style={{ width: "50px", height: "50px", borderRadius: "50%" }} src={item.avatar} alt="" /> {item.name}</div>
                )
            }

        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            sorter: (a, b) => a.role - b.role,
            render: (item) => {
                return (
                    <div>
                        {item === 1 ? <Tag color="success">quản trị viên</Tag> : <Tag color="error">người dùng</Tag>}
                    </div>
                )
            }
        },

        {
            title: "Thao tác",
            dataIndex: '',
            key: 'action',
            render: (item) => (
                <>
                    <Button onClick={() => handleEditUser(item, "edit")}>Sửa</Button>
                    {"  "}<Button onClick={() => handleDeleteUser(item)}>Xóa</Button>
                </>
            )
        }
    ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const onSelectChange = selectedRowKeys => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRowKeys(selectedRowKeys)
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const [dataSource, setdataSource] = useState([])
    const [loadingdata, setLoadingdata] = useState(false)

    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("")
    const fetchData = async (pageIndex) => {
        try {
            setLoadingdata(true)
            const res = await http.get(`/all_user?keyword=${search}&page=${pageIndex}&limit=5`)
            if (res?.status === 200) {
                // const rs = res.data.filter(item => item.role !== 1)
                setdataSource(res?.data.user)
                setTotalItem(res?.data.totalItem)
                setLoadingdata(false)
            }
        } catch (err) {
            NotificationError("", err.msg)
        }
    }
    useEffect(() => {
        fetchData(1)
    }, [search])
    const handleAddUser = () => {
        OpenModal()
    }
    const handleDeleteAll = async () => {
        try {
            let status
            for (let i = 0; i < selectedRowKeys.length; i++) {
                if (selectedRowKeys[i] === user._id) {
                    NotificationError("", "Không thể xóa tài khoản của chính bạn")
                    status = false
                    break;
                } else {
                    status = true
                }
            }
            if (status) {
                const res = await http.post("/delete_user_all", {
                    check: selectedRowKeys
                })
                if (res?.status === 200) {
                    NotificationSuccess('', "Xóa thành công")
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
            }
        } catch (error) {
            console.log(error)
        }
    }
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

    // Modal 
    const [visible, setvisible] = useState(false)
    const OpenModal = () => {
        setvisible(!visible)
    }
    const hideModal = () => {
        clearInput()
        setvisible(false)
        form.resetFields();
    }
    const [input, setInput] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        role: ""
    })
    const clearInput = () => {
        setInput({
            id: "",
            name: "",
            email: "",
            role: ""
        })
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

    const [actLoading, setActLoading] = useState(false)
    const onFinish = async () => {
        const data = {
            ...input,
            name: input.name,
            email: input.email,
            role: input.role,
        }

        if (data.id === "") {
            try {
                setActLoading(true)
                const res = await http.post("/add_user", data)
                if (res?.status === 200) {
                    // const _rs = await http.get(`/all_user?page=${1}&limit=5`);
                    // let surplus = _rs.data.totalItem % 5;
                    // let quotient = Math.floor(_rs.data.totalItem / 5);
                    // let latest_page = surplus !== 0 ? (quotient + 1) : quotient;
                    // await changePage(latest_page, null);
                    NotificationSuccess('', "Thêm mới thành công")
                    setActLoading(false)
                }

                fetchData(1);
                setCurrentPage(1)
                hideModal();
            } catch (error) {
                NotificationError("", error.msg)
            }

        } else {
            if (user._id !== data.id) {
                setActLoading(true)
                const res = await http.patch(`/update_role/${data.id}`, {
                    role: data.role,
                })
                if (res?.status === 200) {
                    await changePage(currentPage, null);
                    NotificationSuccess('', "Update thành công")
                    hideModal()
                    setActLoading(false)
                }
            } else {
                NotificationError("", "Không thể thay đổi quyền chính mình")
            }
        }
    }
    const handleChange = (e, type) => {
        const { value, name } = e.target;
        setInput({
            ...input,
            [type]: value
        })

    }
    const handleChecked = (e, data, id) => {
        if (user._id === id) {
            NotificationError("", "Không thể thay đổi quyền tài khoản chính mình")
        } else {
            if (data === "duccon303@gmail.com") {
                NotificationError("", "Không thể thay đổi quyền tài khoản ADMIN")
            } else {
                setInput({
                    ...input,
                    role: e.target.checked ? 1 : 0
                })
            }
        }
    }


    const handleEditUser = (item, type) => {
        (type = "edit" && OpenModal())
        form.setFieldsValue({
            id: item._id,
            name: item.name,
            email: item.email,
            role: item.role
        })
        setInput({
            id: item._id,
            name: item.name,
            email: item.email,
            role: item.role
        })
    }


    const [userCurrent, setUserCurrent] = useState("")
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);

    const handleCloseModal = () => {
        setIsShowModalDelete(false)
    }
    const handleDeleteUser = (item) => {
        setUserCurrent(item)
        setIsShowModalDelete(true)
    }
    const handleOk = async () => {
        const id = userCurrent._id;
        let url = `/delete_user/${id}`
        if (user._id !== id) {
            if (userCurrent.email !== "duccon303@gmail.com") {
                const rs = await http.delete(url)
                if (rs?.status === 200) {
                    NotificationSuccess('', "Xóa thành công")
                } else {
                    NotificationSuccess('', "Xóa thất bại")
                };
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
            } else {
                NotificationError("", "Không thể xóa tài khoản ADMIN")
                setIsShowModalDelete(false)
            }
        } else {
            setIsShowModalDelete(false)
            NotificationError("", "Không thể xóa tài khoản của chính bạn")
        }
    }
    return (
        <>
            {
                actLoading ? <Loading></Loading> : null
            }
            <div className="user-manager container">
                <h2 className="title-screen">Người dùng</h2>
                <div className="flex-between">
                    <input className="inputCustom" onChange={handleSearch} type="text" placeholder="Tìm kiếm "></input>
                    <button className="btn-add" onClick={handleAddUser}><RiAddLine size={20} />Thêm user</button>
                </div>
                <button className="btn-removes" disabled={selectedRowKeys.length !== 0 ? false : true} onClick={handleDeleteAll}>Xóa tất cả</button>

                <Table
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    rowSelection={rowSelection}
                    rowKey="_id"
                    loading={{
                        spinning: loadingdata,
                        indicator: <LoadingSection />
                    }}
                />
                <Pagination className="pagination-custom"
                    current={currentPage}
                    defaultPageSize={5}
                    total={totalItem}
                    onChange={changePage}></Pagination>
                <Modal
                    title={input.id ? "Cập nhật" : "Thêm mới"}
                    visible={visible}
                    onOk={hideModal}
                    onCancel={hideModal}
                    okText="Ok"
                    cancelText="Trờ lại"
                    footer={
                        [
                            <Button onClick={hideModal}>Trở về</Button>,
                            <Button onClick={handleSubmit}> {input.id !== "" ? "Cập nhật" : "Thêm mới"}</Button>

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
                                    label="Tên người dùng"
                                    name="name"
                                    disabled
                                    value={input && input.name}
                                    onChange={(_) => { handleChange(_, 'name') }}
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập Tên người dùng!");
                                                // const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
                                                // if (regExp.test(value)) return Promise.reject("Tên người dùng sai định dạng")
                                                if (value?.length > 255) return Promise.reject("Tên người dùng không được lớn hơn 255 ký tự");
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                >
                                    <Input
                                        disabled={input.id === "" ? false : true}
                                        placeholder="Nhập tên người dùng"
                                        style={{ borderRadius: '5px', padding: "8px" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    value={input && input.email}

                                    onChange={(_) => { handleChange(_, 'email') }}
                                    rules={[
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                const validation = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
                                                if (value) {
                                                    const listCheck = value.split("@");

                                                    if (
                                                        value.includes("..") ||
                                                        listCheck[0].startsWith(".") ||
                                                        listCheck[0].endsWith(".") ||
                                                        (listCheck.length > 1 &&
                                                            listCheck[1].startsWith(".")) ||
                                                        (listCheck.length > 1 &&
                                                            listCheck[1].endsWith("."))
                                                    ) {
                                                        return Promise.reject(
                                                            "Email không đúng định dạng!"
                                                        );
                                                    }
                                                    if (value.length > 255) {
                                                        return Promise.reject(
                                                            "Email vượt quá 255 ký tự!"
                                                        );
                                                    }
                                                    if (validation.test(value)) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(
                                                        "Email không đúng định dạng!"
                                                    );
                                                } else {
                                                    return Promise.reject(`Vui lòng nhập Email!`);
                                                }
                                            },
                                        }),
                                    ]}
                                >
                                    <Input
                                        disabled={input.id === "" ? false : true}
                                        placeholder="Nhập email người dùng"
                                        style={{ borderRadius: '5px', padding: "8px" }}
                                    // name="title"
                                    />
                                </Form.Item>
                                {
                                    input.id === "" && <Form.Item
                                        label="Mật khẩu"
                                        name="password"
                                        value={input && input.password}
                                        onChange={(_) => { handleChange(_, "password") }}
                                        rules={[
                                            ({ getFieldValue }) => ({
                                                validator(rule, value) {
                                                    if (!value) {
                                                        return Promise.reject(`Vui lòng nhập Mật khẩu!`);
                                                    }
                                                    if (value.length < 6) {
                                                        return Promise.reject(
                                                            "Mật khẩu phải có ít nhất 6-20 ký tự"
                                                        );
                                                    }
                                                    if (value.length > 20) {
                                                        return Promise.reject(
                                                            "Mật khẩu không được quá 20 ký tự"
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder="Nhập mật khẩu người dùng"
                                            style={{ borderRadius: '5px', padding: "8px" }}
                                        />

                                    </Form.Item>
                                }
                                <Form.Item
                                    label="role"
                                    name="role"
                                >
                                    <Checkbox
                                        checked={input.role === 1 ? true : false}
                                        onChange={(e) => handleChecked(e, input.email, input.id)}
                                    ></Checkbox>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    className='career-type-popup'
                    title={`Bạn có chắc chắn muốn xóa người dùng " ${userCurrent.name} " không?"`}
                    visible={isShowModalDelete}
                    onCancel={handleCloseModal}
                >
                    <div className="career-btn">
                        <Button onClick={() => handleCloseModal()} className="status-btn-default">
                            <span className="l-calendar-name">Không</span>
                        </Button>
                        <Button style={{ marginLeft: '20px' }} onClick={(record) => handleOk(record)} className="status-btn-default">
                            <span className="l-calendar-name">Có</span>
                        </Button>
                    </div>
                </Modal>

            </div>
        </>
    );
}

export default UserManager;