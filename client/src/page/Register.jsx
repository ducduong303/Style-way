import { Form, Input } from 'antd';
import React from 'react';
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import { ActRegister } from '../action/auth';
import imgLogin from "../assets/image/loginlogo.png";
import Header from '../components/Header';

function Register(props) {
    const [form] = Form.useForm();
    const dispatch = useDispatch()

    // const [user, setUser] = useState({
    //     name: "",
    //     email: "",
    //     password: "",
    // })
    // const handleLoginSubmit = (e) => {
    //     e.preventDefault();
    //     dispatch(ActRegister(user))
    //     setUser({
    //         name: "",
    //         email: "",
    //         password: "",
    //     })
    // }
    // const handleChangeInput = (e) => {
    //     const { name, value } = e.target
    //     setUser({
    //         ...user,
    //         [name]: value
    //     })
    // }


    const onFinish = (values) => {
        dispatch(ActRegister(values)).then(res => {
            form.resetFields();
        })

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <Header></Header>
            <div className="login-form col-lg-8">
                <div className="login-left col-lg-6">
                    <img src={imgLogin} alt=""></img>
                </div>
                <div className="login-rigth col-lg-6">
                    <h3>Đăng ký ngay </h3>
                    <br />
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                        className="form"
                        form={form}
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
                            label="Mật khẩu"
                            name="password"
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
                                placeholder="Nhập mật khẩu của bạn"
                                style={{ borderRadius: '5px', padding: "8px" }}
                            // prefix={<LockOutlined className="site-form-item-icon" />}
                            />
                        </Form.Item>
                        <Form.Item >
                            <button className="btn-login"
                                htmlType="submit">
                                Đăng ký
            </button>
                        </Form.Item>
                    </Form>
                    <div className="login-footer">
                        <p >Nếu có tài khoản vui lòng <Link to="/login" >Đăng nhập</Link></p>
                        <p> <Link to="/forgot-password" >Quên mật khẩu</Link></p>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Register;