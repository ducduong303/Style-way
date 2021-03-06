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
            getDistricts(user?.address?.[0]?.province) // get huy???n v???i t???nh th??nh
            getWards(user?.address?.[0]?.district) // get x?? v???i huy???n
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
                                    <h5>S???a h??? s??</h5>
                                </div>
                            </div>
                        }>

                        </TabPane>
                        <TabPane tab={
                            <div className="tabPane">
                                {/* <> {isAdmin ? "Admin" : "User"}</h4> */}
                                <p>T??i kho???n c???a t??i</p>
                            </div>
                        } key="1">
                            <div className="profile-box">
                                <div className="left">
                                    <div className="profile-content">
                                        <h3>H??? s?? </h3>
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
                                                    label="T??n ng?????i d??ng"
                                                    name="name"

                                                    rules={[
                                                        () => ({
                                                            validator(rule, value) {
                                                                if (!value) return Promise.reject("Vui l??ng nh???p T??n ng?????i d??ng!");
                                                                // const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
                                                                // if (regExp.test(value)) return Promise.reject("T??n ng?????i d??ng sai ?????nh d???ng")
                                                                if (value?.length > 255) return Promise.reject("T??n ng?????i d??ng kh??ng ???????c l???n h??n 255 k?? t???");
                                                                return Promise.resolve();
                                                            }
                                                        })
                                                    ]}
                                                >
                                                    <Input
                                                        value={user?.name}
                                                        placeholder="Nh???p t??n c???a b???n"
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
                                                                            "Email kh??ng ????ng ?????nh d???ng!"
                                                                        );
                                                                    }
                                                                    if (value.length > 255) {
                                                                        return Promise.reject(
                                                                            "Email v?????t qu?? 255 k?? t???!"
                                                                        );
                                                                    }
                                                                    if (validation.test(value)) {
                                                                        return Promise.resolve();
                                                                    }
                                                                    return Promise.reject(
                                                                        "Email kh??ng ????ng ?????nh d???ng!"
                                                                    );
                                                                } else {
                                                                    return Promise.reject(`Vui l??ng nh???p Email!`);
                                                                }
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="Nh???p email c???a b???n"
                                                        style={{ borderRadius: '5px', padding: "8px" }}

                                                    // prefix={<MailOutlined twoToneColor="#ccc" className="icon-input" />}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="S??? ??i???n tho???i"
                                                    name="phone"
                                                    rules={
                                                        [
                                                            () => ({
                                                                validator(rule, value) {
                                                                    if (!value) return Promise.resolve();
                                                                    // if (!value) return Promise.reject("Vui l??ng nh???p S??? ??i???n tho???i!");
                                                                    // if (value && value.trim() === '') return Promise.reject("Vui l??ng nh???p S??? ??i???n tho???i!");
                                                                    const regExp = /^[0-9]*$/;
                                                                    // if (!regExp.test(value.replace('+', ''))) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
                                                                    if (value.startsWith('0') && value.length !== 10) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
                                                                    if (value.startsWith('84') && value.length !== 11) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
                                                                    if (!(value.startsWith('0') || value.startsWith('84'))) return Promise.reject("S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng");
                                                                    const phoneHeader = ['86', '96', '97', '98', '32', '33', '34', '35', '36', '37', '38', '39', '88', '91', '94', '93', '84', '85', '81', '82',
                                                                        '89', '90', '93', '70', '79', '77', '76', '78', '92', '56', '58', '99', '59']
                                                                    if (value.startsWith('0') && !phoneHeader.includes(value.substring(1, 3))
                                                                        || value.startsWith('84') && !phoneHeader.includes(value.substring(2, 4))) {
                                                                        return Promise.reject("S??? ??i???n tho???i kh??ng t???n t???i");
                                                                    }

                                                                    return Promise.resolve();
                                                                }
                                                            })
                                                        ]
                                                    }
                                                >
                                                    <Input
                                                        placeholder="Nh???p s??? ??i???n tho???i c???a b???n"
                                                        style={{ borderRadius: '5px', padding: "8px" }}
                                                    // prefix={<LockOutlined className="site-form-item-icon" />}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Gi???i t??nh"
                                                    name="gender"
                                                >
                                                    <Radio.Group >
                                                        <Radio value={"0"}>Nam</Radio>
                                                        <Radio value={"1"}>N???</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                                <Form.Item
                                                    label="Ng??y sinh"
                                                    name="birthday"
                                                >
                                                    <DatePicker value={user?.birthday} disabledDate={disabledDate} format={FORMAT_DATE} bordered={false} placeholder="Ng??y sinh" />
                                                </Form.Item>
                                                <Form.Item >
                                                    <button className="btn-Style"
                                                        // htmlType="submit"
                                                        type="submit"

                                                    >
                                                        C???p nh???t
                                                </button>
                                                </Form.Item>
                                                <p>Vui l??ng nh???p th??ng tin ch??nh x??c c???a b???n ????? ch??ng t??i c?? th??? x??c nh???n ch??nh x??c </p>
                                            </Form>

                                            <div className="profile-personal-img col-lg-6">
                                                <div className="profile-avatar">
                                                    {
                                                        loading ? <img src="https://media1.giphy.com/media/3oEjI6SIIHBdRxXI40/200.gif" alt="" /> :
                                                            <img src={avatar ? URL.createObjectURL(avatar) : user?.avatar} alt="" />
                                                    }

                                                    <span>
                                                        {/* <p>Thay ?????i</p> */}
                                                        {/* <AiOutlineCamera size={25}></AiOutlineCamera> */}
                                                        <input type="file" id="imgAvatar" name="file" className="file" onChange={handleChangeAvatar} />
                                                    </span>

                                                </div>

                                                <label htmlFor="imgAvatar" className="btn-selecImg">Ch???n ???nh</label>
                                                <p>D???ng l?????ng file t???i ??a 1 MB</p>
                                                <p>?????nh d???ng:.JPEG, .PNG</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab={
                            <div className="tabPane">
                                <p>?????a ch???</p>
                            </div>
                        } key="2">
                            <div className="profile-address">
                                <h3>?????a ch???</h3>
                                <Form
                                    name="basic"
                                    onFinish={onFinishSubmitAddress}
                                    // onFinishFailed={onFinishFailed}
                                    layout="vertical"
                                    className="form col-lg-6"
                                    form={form3}
                                >
                                    <Form.Item
                                        label="?????a ch??? "
                                        name="delivery"
                                        rules={[
                                            () => ({
                                                validator(rule, value) {
                                                    if (!value) return Promise.reject("Vui l??ng nh???p ?????a ch??? ng?????i d??ng!");
                                                    if (value?.length > 100) return Promise.reject("?????a ch??? ng?????i d??ng kh??ng ???????c l???n h??n 100 k?? t???");
                                                    return Promise.resolve();
                                                }
                                            })
                                        ]}
                                    >
                                        <Input
                                            value={user?.name}
                                            placeholder="Nh???p ?????a ch??? n??i ??? c???a b???n"
                                            style={{ borderRadius: '5px', padding: "8px" }}

                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="T???nh th??nh "
                                        name="province"
                                        rules={
                                            [
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui ch???n t???nh th??nh!");
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]
                                        }
                                    >
                                        <Select

                                            placeholder="Ch???n T???nh Th??nh"
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
                                        label="Qu???n huy???n "
                                        name="district"
                                        rules={
                                            [
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui ch???n qu???n huy???n!");
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]
                                        }
                                    >
                                        <Select placeholder="Ch???n Qu???n Huy???n"
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
                                        label="X?? ph?????ng "
                                        name="wards"
                                        rules={
                                            [
                                                () => ({
                                                    validator(rule, value) {
                                                        if (!value) return Promise.reject("Vui ch???n x?? ph?????ng!");
                                                        return Promise.resolve();
                                                    }
                                                })
                                            ]
                                        }
                                    >
                                        <Select

                                            value={address.wards}
                                            onChange={(value) => handleChangeWard(value)}
                                            placeholder="Ch???n x?? ph?????ng"
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
                                            C???p nh???t
                                                </button>
                                    </Form.Item>
                                    <p>Vui l??ng nh???p th??ng tin ch??nh x??c c???a b???n ????? ch??ng t??i c?? th??? x??c nh???n ch??nh x??c </p>
                                </Form>
                            </div>

                        </TabPane>
                        <TabPane tab={
                            <div className="tabPane">
                                <p>????n h??ng</p>
                            </div>
                        } key="3">
                            <div className="profile-oder">
                                <h3>????n h??ng c???a b???n</h3>
                                <MyOder></MyOder>
                            </div>
                        </TabPane>
                        <TabPane tab={
                            <div className="tabPane">
                                <p>?????i m???t kh???u</p>
                            </div>
                        } key="4">
                            <div className="profile-changePass">
                                <h3>?????i m???t kh???u</h3>
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
                                        label="M???t kh???u hi???n t???i"
                                        rules={[
                                            ({ getFieldValue }) => ({
                                                validator(rule, value) {
                                                    if (!value) {
                                                        return Promise.reject(`Vui l??ng nh???p M???t kh???u!`);
                                                    }
                                                    if (value.length < 6) {
                                                        return Promise.reject(
                                                            "M???t kh???u ph???i c?? ??t nh???t 6-20 k?? t???"
                                                        );
                                                    }
                                                    if (value.length > 20) {
                                                        return Promise.reject(
                                                            "M???t kh???u kh??ng ???????c qu?? 20 k?? t???"
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder="Nh???p m???t kh???u hi???n t???i"
                                            style={{ borderRadius: '5px', padding: "8px" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="new_password"
                                        label="M???t kh???u m???i"
                                        rules={[
                                            ({ getFieldValue }) => ({
                                                validator(rule, value) {
                                                    if (!value) {
                                                        return Promise.reject(`Vui l??ng nh???p M???t kh???u!`);
                                                    }
                                                    if (value.length < 6) {
                                                        return Promise.reject(
                                                            "M???t kh???u ph???i c?? ??t nh???t 6-20 k?? t???"
                                                        );
                                                    }
                                                    if (value.length > 20) {
                                                        return Promise.reject(
                                                            "M???t kh???u kh??ng ???????c qu?? 20 k?? t???"
                                                        );
                                                    }
                                                    return Promise.resolve();
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder="Nh???p m???t kh???u m???i"
                                            style={{ borderRadius: '5px', padding: "8px" }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="cf_password"
                                        label="X??c nh???n m???t kh???i"
                                        dependencies={['new_password']}
                                        hasFeedback
                                        rules={[

                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value) {
                                                        return Promise.reject(`Vui l??ng x??c nh???n m???t kh???u!`);
                                                    }
                                                    if (!value || getFieldValue('new_password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('M???t kh???u kh??ng tr??ng kh???p!'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder="Nh???p m???t kh???u x??c nh???n"
                                            style={{ borderRadius: '5px', padding: "8px" }}
                                        />
                                    </Form.Item>
                                    <Form.Item >
                                        <button className="btn-Style"
                                            // htmlType="submit"
                                            type="submit"
                                        >
                                            C???p nh???t
                                                </button>
                                    </Form.Item>
                                    <p>Vui l??ng kh??ng chia s??? m???t kh???u cho ng?????i kh??c ????? ?????m b???o an to??n cho m???t kh???u c???a b???n</p>
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