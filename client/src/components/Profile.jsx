import { AccountBookOutlined, AppstoreOutlined, GiftOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Menu, Modal, Radio, DatePicker, Pagination, Row, Select, Table, Tabs } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Route } from 'react-router-dom';
import subVn from "sub-vn";
import { ActUpdateInfo } from "../action/auth";
import http from '../api/http';
import { checkImage } from '../common/ImageUpload';
import LoadingTable from '../common/LoadingTable';
import { NotificationError, NotificationSuccess } from '../common/Notification';
import Header from './Header';
import moment from 'moment';
import MyOder from "./MyOder"
import Loading from '../common/Loading';
import OderDetail from './Oder/OderDetail';
const { SubMenu } = Menu;
const { Option } = Select;
const { TabPane } = Tabs;


function Profile(props) {
    const FORMAT_DATE = ["DD-MM-YYYY", "DD/MM/YYYY"];
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();
    const [form4] = Form.useForm();
    const auth = useSelector(state => state.auth)
    // const token = useSelector(state => state.token)
    const dispatch = useDispatch()
    const [tabPosition] = useState('left')
    const { user, isAdmin } = auth
    const [form] = Form.useForm();
    const [data, setData] = useState({
        name: "",
        email: ""
    })

    useEffect(() => {
        setData({
            ...data,
            name: user.name,
            email: user.email

        })
    }, [])


    const { name, email } = data
    // const [loading, setLoading] = useState(false)
    const [avatar, setAvatar] = useState(false)

    // const handleChangeInput = (e) => {
    //     const { name, value } = e.target;
    //     setData({ ...data, [name]: value })
    // }
    const handleChangeAvatar = async (e) => {
        e.preventDefault();
        const file = e.target.files[0]
        const err = checkImage(file);
        // if (err) return false;
        // let formData = new FormData()
        // formData.append('file', file)
        // setLoading(true)
        // const res = await axios.post('/image/upload', formData, {
        //     headers: { 'content-type': 'multipart/form-data', Authorization: token }
        // })
        // setAvatar(res.data.url)


        // setAvatar(URL.createObjectURL(file))
        // setLoading(true)
        // const media = await ImageUpload([file])
        // setAvatar(media[0].url)
        // setLoading(false)

        // setLoading(true)
        // const media = await ImageUpload([file])
        // setAvatar(media[0].url)

        // setLoading(false)
        setAvatar(file)
    }


    const handleChangeTab = (activeKey) => {

        if (activeKey === "4") {
            form4.resetFields();
        }
    }

    const [address, setAddress] = useState({
        name: "",
        phone: "",
        delivery: "",
        province: "",
        district: "",
        wards: ""
    })
    useEffect(() => {
        if (user.address !== null) {
            getDistricts(user?.address?.[0]?.province) // get huyện với tỉnh thành
            getWards(user?.address?.[0]?.district) // get xã với huyện
            form3.setFieldsValue({
                delivery: user?.address?.[0]?.delivery,
                province: user?.address?.[0]?.province,
                district: user?.address?.[0]?.district,
                wards: user?.address?.[0]?.wards,
            })

        }
    }, [user])
    // const [provinces, setProvinces] = useState("")
    // const [district, setDistrict] = useState("")

    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const handleChangeDelivery = (e) => {
        const { value, name } = e.target;
        setAddress({
            [name]: value
        })
    }
    const handleProvinceCode = (value) => {
        setAddress({
            ...address,
            province: value
        })
        getDistricts(value)
    }
    const handleChangeDistricts = (value) => {
        setAddress({
            ...address,
            district: value
        })
    }
    const handleChangeWard = (value) => {
        setAddress({
            ...address,
            wards: value
        })
    }
    const getDistricts = (value) => {
        const res = subVn.getDistrictsByProvinceCode(value)
        setDistricts(res)
    }
    const getWards = (value) => {
        const res = subVn.getWardsByDistrictCode(value)
        setWards(res)

    }


    const [loading, setloading] = useState(false)
    const onFinishSubmitPersonal = (values) => {
        setloading(true)
        const userValue = {
            avatar: avatar ? avatar : user.avatar,
            ...values
            // address
        }
        dispatch(ActUpdateInfo({
            userValue
        })).then(res => setloading(false))
    };
    // const onFinishFailed = (errorInfo) => {
    //     console.log('Failed:', errorInfo);
    // };

    useEffect(() => {
        form2.setFieldsValue({
            name: user.name,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday ? moment(user.birthday) : null,
            gender: user.gender,
            phone: user.phone
        })
    }, [user])

    const disabledDate = (currentDate) => {
        const currentTimes = currentDate?.valueOf();
        const nowTimes = moment().subtract(1, 'days').endOf("day").valueOf();
        return currentTimes >= nowTimes;
    }

    const onFinishSubmitAddress = (values) => {
        const userValue = {
            name: name ? name : user.name,
            avatar: avatar ? avatar : user.avatar,
            gender: user?.gender,
            birthday: user?.birthday,
            phone: user?.phone,
            address: { ...values }
        }
        setloading(true)
        dispatch(ActUpdateInfo({
            userValue
        })).then(res => setloading(false))
    }
    const onFinishSubmitChangePass = async (values) => {
        try {
            const res = await http.post("/change_password", {
                cr_password: values.cr_password,
                new_password: values.new_password
            })
            if (res?.status === 200) {
                NotificationSuccess("", res.data.msg)
                form4.resetFields()
            }
        } catch (err) {
            NotificationError("", err.msg)
        }
    }

    return (
        <>
            {
                loading ? <Loading></Loading> : null
            }
            <Header></Header>
            <div className="profile">
                <div className="container">
                    <Tabs tabPosition={tabPosition} onChange={handleChangeTab} defaultActiveKey="1" tabBarStyle={{ color: "#000" }} >
                        <TabPane disabled key="0" tab={
                            <div className="profile-title">
                                <img className="profile-img" src={user?.avatar} alt="" />
                                <div className="profile-user">
                                    <h4> {user?.name}</h4>
                                    <h5>Sửa hồ sơ</h5>
                                </div>
                            </div>
                        }>

                        </TabPane>
                        <TabPane tab={
                            <div className="tabPane">
                                {/* <> {isAdmin ? "Admin" : "User"}</h4> */}
                                <p>Tài khoản của tôi</p>
                            </div>
                        } key="1">
                            <div className="profile-box">
                                <div className="left">
                                    <div className="profile-content">
                                        <h3>Hồ sơ </h3>
                                        <div className="profile-personal row">
                                            <Form
                                                name="basic"
                                                onFinish={onFinishSubmitPersonal}
                                                // onFinishFailed={onFinishFailed}
                                                layout="vertical"
                                                className="form col-lg-6"
                                                form={form2}
                                            >
                                                <Form.Item
                                                    label="Tên người dùng"
                                                    name="name"

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
                                                        value={user?.name}
                                                        placeholder="Nhập tên của bạn"
                                                        style={{ borderRadius: '5px', padding: "8px" }}

                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Email"
                                                    name="email"
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
                                                        placeholder="Nhập email của bạn"
                                                        style={{ borderRadius: '5px', padding: "8px" }}

                                                    // prefix={<MailOutlined twoToneColor="#ccc" className="icon-input" />}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Số điện thoại"
                                                    name="phone"
                                                    rules={
                                                        [
                                                            () => ({
                                                                validator(rule, value) {
                                                                    if (!value) return Promise.resolve();
                                                                    // if (!value) return Promise.reject("Vui lòng nhập Số điện thoại!");
                                                                    // if (value && value.trim() === '') return Promise.reject("Vui lòng nhập Số điện thoại!");
                                                                    const regExp = /^[0-9]*$/;
                                                                    // if (!regExp.test(value.replace('+', ''))) return Promise.reject("Số điện thoại không đúng định dạng");
                                                                    if (value.startsWith('0') && value.length !== 10) return Promise.reject("Số điện thoại không đúng định dạng");
                                                                    if (value.startsWith('84') && value.length !== 11) return Promise.reject("Số điện thoại không đúng định dạng");
                                                                    if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("Số điện thoại không đúng định dạng");
                                                                    const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
                                                                        '89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
                                                                    if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
                                                                        || value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
                                                                        return Promise.reject("Số điện thoại không tồn tại");
                                                                    }

                                                                    return Promise.resolve();
                                                                }
                                                            })
                                                        ]
                                                    }
                                                >
                                                    <Input
                                                        placeholder="Nhập số điện thoại của bạn"
                                                        style={{ borderRadius: '5px', padding: "8px" }}
                                                    // prefix={<LockOutlined className="site-form-item-icon" />}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Giới tính"
                                                    name="gender"
                                                >
                                                    <Radio.Group >
                                                        <Radio value={"0"}>Nam</Radio>
                                                        <Radio value={"1"}>Nữ</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <Form.Item
                                                    label="Ngày sinh"
                                                    name="birthday"
                                                >
                                                    <DatePicker value={user?.birthday} disabledDate={disabledDate} format={FORMAT_DATE} bordered={false} placeholder="Ngày sinh" />
                                                </Form.Item>
                                                <Form.Item >
                                                    <button className="btn-Style"
                                                        // htmlType="submit"
                                                        type="submit"

                                                    >
                                                        Cập nhật
                                                </button>
                                                </Form.Item>
                                                <p>Vui lòng nhập thông tin chính xác của bạn để chúng tôi có thể xác nhận chính xác </p>
                                            </Form>

                                            <div className="profile-personal-img col-lg-6">
                                                <div className="profile-avatar">
                                                    {
                                                        loading ? <img src="https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" alt="" /> :
                                                            <img src={avatar ? URL.createObjectURL(avatar) : user?.avatar} alt="" />
                                                    }

                                                    <span>
                                                        {/* <p>Thay đổi</p> */}
                                                        {/* <AiOutlineCamera size={25}></AiOutlineCamera> */}
                                                        <input type="file" id="imgAvatar" name="file" className="file" onChange={handleChangeAvatar} />
                                                    </span>

                                                </div>

                                                <label htmlFor="imgAvatar" className="btn-selecImg">Chọn ảnh</label>
                                                <p>Dụng lượng file tối đa 1 MB</p>
                                                <p>Định dạng:.JPEG, .PNG</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab={
                            <div className="tabPane">
                                <p>Địa chỉ</p>
                            </div>
                        } key="2">
                            <div className="profile-address">
                                <h3>Địa chỉ</h3>
                                <Form
                                    name="basic"
                                    onFinish={onFinishSubmitAddress}
                                    // onFinishFailed={onFinishFailed}
                                    layout="vertical"
                                    className="form col-lg-6"
                                    form={form3}
                                >
                                    <Form.Item
                                        label="Địa chỉ "
                                        name="delivery"
                                        rules={[
                                            () => ({
                                                validator(rule, value) {
                                                    if (!value) return Promise.reject("Vui lòng nhập địa chỉ người dùng!");
                                                    if (value?.length > 100) return Promise.reject("Địa chỉ người dùng không được lớn hơn 100 ký tự");
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input
                                            value={user?.name}
                                            placeholder="Nhập địa chỉ nơi ở của bạn"
                                            style={{ borderRadius: '5px', padding: "8px" }}

                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Tỉnh thành "
                                        name="province"
                                        rules={
                                            [
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui chọn tỉnh thành!");
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]
                                        }
                                    >
                                        <Select

                                            placeholder="Chọn Tỉnh Thành"
                                            value={address.province}
                                            onChange={(value) => {
                                                handleProvinceCode(value)
                                            }} >
                                            {
                                                subVn.getProvinces()?.map((item, index) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>{item.name}</Option>
                                                    )
                                                })

                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="Quận huyện "
                                        name="district"
                                        rules={
                                            [
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui chọn quận huyện!");
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]
                                        }
                                    >
                                        <Select placeholder="Chọn Quận Huyện"
                                            value={address.district}
                                            // defaultValue={address.district}
                                            onChange={(value) => {
                                                handleChangeDistricts(value)
                                                getWards(value)
                                            }}
                                        >
                                            {
                                                districts.length > 0 ? districts?.map((item, index) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>{item.name}</Option>
                                                    )
                                                }) : null
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="Xã phường "
                                        name="wards"
                                        rules={
                                            [
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui chọn xã phường!");
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]
                                        }
                                    >
                                        <Select

                                            value={address.wards}
                                            onChange={(value) => handleChangeWard(value)}
                                            placeholder="Chọn xã phường"
                                        >
                                            {
                                                wards?.map((item, index) => {
                                                    return (
                                                        <Option key={item.code} value={item.code}>{item.name}</Option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item >
                                        <button className="btn-Style"
                                            // htmlType="submit"
                                            type="submit"
                                        >
                                            Cập nhật
                                                </button>
                                    </Form.Item>
                                    <p>Vui lòng nhập thông tin chính xác của bạn để chúng tôi có thể xác nhận chính xác </p>
                                </Form>
                            </div>

                        </TabPane>
                        <TabPane tab={
                            <div className="tabPane">
                                <p>Đơn hàng</p>
                            </div>
                        } key="3">
                            <div className="profile-oder">
                                <h3>Đơn hàng của bạn</h3>
                                <MyOder></MyOder>
                            </div>
                        </TabPane>
                        <TabPane tab={
                            <div className="tabPane">
                                <p>Đổi mật khẩu</p>
                            </div>
                        } key="4">
                            <div className="profile-changePass">
                                <h3>Đổi mật khẩu</h3>
                                <Form
                                    name="basic"
                                    onFinish={onFinishSubmitChangePass}
                                    // onFinishFailed={onFinishFailed}
                                    layout="vertical"
                                    className="form col-lg-6"
                                    form={form4}
                                >
                                    <Form.Item
                                        name="cr_password"
                                        label="Mật khẩu hiện tại"
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
                                            placeholder="Nhập mật khẩu hiện tại"
                                            style={{ borderRadius: '5px', padding: "8px" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="new_password"
                                        label="Mật khẩu mới"
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
                                            placeholder="Nhập mật khẩu mới"
                                            style={{ borderRadius: '5px', padding: "8px" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="cf_password"
                                        label="Xác nhận mật khẩi"
                                        dependencies={['new_password']}
                                        hasFeedback
                                        rules={[

                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value) {
                                                        return Promise.reject(`Vui lòng xác nhận mật khẩu!`);
                                                    }
                                                    if (!value || getFieldValue('new_password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Mật khẩu không trùng khớp!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder="Nhập mật khẩu xác nhận"
                                            style={{ borderRadius: '5px', padding: "8px" }}
                                        />
                                    </Form.Item>
                                    <Form.Item >
                                        <button className="btn-Style"
                                            // htmlType="submit"
                                            type="submit"
                                        >
                                            Cập nhật
                                                </button>
                                    </Form.Item>
                                    <p>Vui lòng không chia sẻ mật khẩu cho người khác để đảm bảo an toàn cho mật khẩu của bạn</p>
                                </Form>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>

            </div>
        </>
    );
}

export default Profile;