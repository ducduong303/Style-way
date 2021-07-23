import { Col, Form, Input, Radio, Row, Select, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { BiPhone } from 'react-icons/bi';
import { FiMail, FiMapPin } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import subVn from "sub-vn";
import { v4 as uuidv4 } from 'uuid';
import { ActUpdateInfo } from '../../action/auth';
import { removeAllProduct } from '../../action/cart';
import http from '../../api/http';
import { NotificationError, NotificationSuccess } from '../../common/Notification';
import Header from '../Header';
import PaypalButton from "./PaypalButton";
const { Option } = Select;
function Shipping(props) {
    const history = useHistory()
    const dispatch = useDispatch()
    const [form] = Form.useForm();
    const auth = useSelector(state => state.auth)
    // const cart = useSelector(state => state.cart)
    const { user } = auth;
    const oder = JSON.parse(localStorage.getItem("oder"));
    const oderKey = JSON.parse(localStorage.getItem("oderKey"));
    const [dataSource, setDataSource] = useState(oder);
    const [total, setTotal] = useState(0)

    const getTotal = () => {
        const total = oder?.reduce((prev, item) => {
            return prev + (item.price * item.count)
        }, 0)
        setTotal(total)
    }
    useEffect(() => {
        getTotal()
    }, [oder])

    const [province, setProvince] = useState("")
    const [district, setDistrict] = useState("")
    const [ward, setWard] = useState("")

    const provinceList = subVn.getProvinces();
    const fetchProvince = () => {
        provinceList?.forEach((item, index) => {
            if (item.code === user?.address?.[0]?.province) {
                setProvince(item.name)
            }
        })
    }
    const districtList = subVn.getDistrictsByProvinceCode(user?.address?.[0]?.province);
    const fetChDistrictList = () => {
        districtList?.forEach((item, index) => {
            if (item.code === user?.address?.[0].district) {
                setDistrict(item.name)
            }
        })
    }
    const wardList = subVn.getWardsByDistrictCode(user?.address?.[0]?.district)
    const fetChWard = () => {
        wardList?.forEach((item, index) => {
            if (item.code === user?.address?.[0].wards) {
                setWard(item.name)
            }
        })
    }


    useEffect(() => {
        fetchProvince()
        fetChDistrictList()
        fetChWard()
    }, [districtList, wardList])


    const onFinish = async (value) => {

        const userValue = {
            name: user?.name,
            avatar: user?.avatar,
            address: [value]
        }
        dispatch(ActUpdateInfo({
            userValue
        })).then(res => {
            // NotificationSuccess("", "Thêm địa chỉ thành công")
        })

    }

    const columns = [
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

    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])
    const handleProvinceCode = (value) => {
        getDistricts(value)
        form.setFieldsValue({ district: null });
        form.setFieldsValue({ ward: null });
    }
    const getDistricts = (value) => {
        const res = subVn.getDistrictsByProvinceCode(value)
        setDistricts(res)

    }
    const getWards = (value) => {
        const res = subVn.getWardsByDistrictCode(value)
        setWards(res)
        form.setFieldsValue({ ward: null });
    }

    const [methodPay, setMethodPay] = useState(null)
    const handleOder = async () => {
        if (methodPay === null) {
            // alert("Vui lòng chọn phương thức thanh toán ")
            NotificationError("", "Vui lòng chọn phương thức thanh toán ")
            return
        }
        if (methodPay === 1) {
            const oderNew = {
                cart: oder,
                address: {
                    delivery: user?.address?.[0]?.delivery,
                    wards: ward,
                    district: district,
                    province: province,
                    phone: user?.address?.[0]?.phone,
                },
                isPaid: false,
                paymentID: uuidv4(),
                paymentMethod: "Thanh toán khi nhận hàng",
                totalPrice: total,
            }
            const res = await http.post("/oder", {
                oderNew
            })
            if (res?.status === 200) {
                dispatch(removeAllProduct(oderKey)).then(rs => {
                    history.push("/cart")
                    localStorage.removeItem("oder");
                    localStorage.removeItem("oderKey");
                    NotificationSuccess("", rs.msgPay)
                })
            }
        }
    }

    const tranSuccess = async (payment) => {
        const oderNew = {
            cart: oder,
            address: {
                ...payment.address,
                phone: user?.address?.[0]?.phone,
            },
            isPaid: payment.paid,
            paymentID: payment.paymentID,
            paymentMethod: "Paypal",
            totalPrice: total,
        }
        const res = await http.post("/oder", {
            oderNew
        })
        if (res?.status === 200) {
            dispatch(removeAllProduct(oderKey)).then(rs => {
                history.push("/cart")
                localStorage.removeItem("oder");
                localStorage.removeItem("oderKey");
                NotificationSuccess("", rs.msgPay)
            })
        }
        // console.log(oderNew)
    }
    const onChangeMethodPay = (e) => {
        if (e.target.value) {
            setMethodPay(e.target.value)
        }
    }

    return (

        <>
            <Header />
            <div className="shipping">
                <div className="container">
                    <div className="oder-shipping row">
                        <div className="col-lg-9">
                            {
                                user?.address?.length === 0 ?
                                    <div className="oder-address">
                                        <div className="form-gr">
                                            <h2>Địa chỉ nhận hàng</h2>
                                            <Form
                                                name="basic"
                                                form={form}
                                                layout="vertical"
                                                // initialValues={{ remember: true }}
                                                onFinish={onFinish}
                                            >

                                                <Row justify="space-between">
                                                    <Col span={10}>
                                                        <Form.Item
                                                            label="Tên Người Nhận"
                                                            name="name"
                                                            rules={[
                                                                () => ({
                                                                    validator(rule, value) {
                                                                        if (!value) return Promise.reject("Vui lòng nhập Tên người nhận hàng!");
                                                                        // const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
                                                                        // if (regExp.test(value)) return Promise.reject("Tên người nhận hàng sai định dạng")
                                                                        if (value?.length > 255) return Promise.reject("Tên người nhận hàng không được lớn hơn 255 ký tự");
                                                                        return Promise.resolve();
                                                                    }
                                                                })
                                                            ]}
                                                        >
                                                            <Input placeholder="Vui lòng nhập tên người nhận"
                                                                style={{ borderRadius: '5px', padding: "8px" }}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Số điện thoại"
                                                            name="phone"
                                                            placeholder="Vui lòng nhập số điện thọai"
                                                            rules={
                                                                [
                                                                    () => ({
                                                                        validator(rule, value) {
                                                                            // if (!value) return Promise.resolve();
                                                                            if (!value) return Promise.reject("Vui lòng nhập Số điện thoại!");
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
                                                            <Input placeholder="Vui lòng nhập số điện thọai" style={{ borderRadius: '5px', padding: "8px" }} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12}>
                                                        <Form.Item
                                                            label="Địa chỉ nhận hàng"
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
                                                            <Input placeholder="Vui lòng nhập địa chỉ" style={{ borderRadius: '5px', padding: "8px" }} />
                                                        </Form.Item>

                                                        <Form.Item
                                                            label="Tỉnh /thành phố"
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
                                                                placeholder="Vui lòng chọn tỉnh thành"
                                                                onChange={(value) => {
                                                                    handleProvinceCode(value)
                                                                }}
                                                            >
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
                                                            label="Quận /huyện"
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
                                                            <Select
                                                                placeholder="Chọn quận huyện"
                                                                onChange={(value) => {
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
                                                            label="Phường /xã"
                                                            name="wards"
                                                            placeholder="Chọn xã phường"
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
                                                            <button className="btn-Style" type="submit">
                                                                Xác nhận
                                                        </button>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </div>
                                    </div>
                                    :
                                    <>
                                        <h2>Gói hàng của bạn </h2>
                                        <Table
                                         scroll={{ x: true }}
                                            dataSource={dataSource}
                                            pagination={false}
                                            columns={columns}
                                            rowKey="key"

                                        />
                                    </>
                            }
                        </div>
                        <div className="col-lg-3">

                            {

                                user?.address?.length > 0 ? <div className="oder-address">
                                    <h2>Địa chỉ giao hàng</h2>
                                    <div style={{ margin: "1rem 0" }}>
                                        <h4> Người nhận: {user?.address?.[0]?.name}</h4>
                                        <h4><FiMapPin size={20} /> Địa chỉ:
                                        {
                                                `${user?.address?.[0]?.delivery}, ${ward},${district && district} , ${province}`

                                            }
                                        </h4>
                                        <h4><BiPhone size={20} /> {user?.address?.[0]?.phone}</h4>
                                        <h4><FiMail size={20} /> {user.email}</h4>
                                    </div>
                                </div> : ""
                            }
                            <div className="oder-info">
                                <h2>Thông tin đơn hàng</h2>
                                <div className="info-oder">
                                    <h4>Tạm tính({dataSource?.length} sản phẩm)<span>{total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></h4>
                                    <h4>Phí giao hàng: <span>0đ</span></h4>
                                    <h4>Tổng đơn hàng : <span>{total?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></h4>
                                </div>
                                <div>
                                    <h4>Phương thức thanh toán</h4>
                                    <Radio.Group onChange={onChangeMethodPay} >
                                        <Radio disabled={user?.address?.length === 0} value={1}>Thanh toán khi nhận hàng</Radio>
                                        <Radio disabled={user?.address?.length === 0} value={2}>Thanh toán online Paypal</Radio>
                                    </Radio.Group>
                                </div>
                                <br></br>

                                {
                                    methodPay === 2 ? <PaypalButton
                                        total={total}
                                        tranSuccess={tranSuccess}
                                    ></PaypalButton> : <button
                                        disabled={user?.address?.length === 0}
                                        onClick={handleOder}
                                        style={{ width: "100%" }}
                                        className="btn-Style"
                                    >Đặt hàng</button>
                                }
                            </div>
                        </div>
                    </div>

                </div>


            </div >
        </>
    );
}

export default Shipping;