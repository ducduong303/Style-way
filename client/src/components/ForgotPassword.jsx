import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ActForgotPassword } from '../action/auth';
import Header from './Header';
import imgLogin from "../assets/image/loginlogo.png";
function ForgotPassword(props) {
    const dispatch = useDispatch()
    // const [email, setEmail] = useState("")
    // const handleLoginSubmit = (e) => {
    //     e.preventDefault()

    //     // dispatch(ActForgotPassword(email))
    // }
    // const handleChangeInput = (e) => {
    //     setEmail(e.target.value)
    // }


    const onFinish = (values) => {
        // dispatch(ActLogin(values))
        dispatch(ActForgotPassword(values.email))

    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Header></Header>
            <div className="login-form">
                <div className="login-form col-lg-8">
                    <div className="login-left col-lg-6">
                        <img src={imgLogin} alt=""></img>
                    </div>
                    <div className="login-rigth col-lg-6">
                        <h3>Quên mật khẩu </h3>
                        <br></br>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout="vertical"
                            className="form"
                        >
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
                            <Form.Item >
                                <button className="btn-login"
                                    htmlType="submit">
                                    Submit
                            </button>
                            </Form.Item>
                        </Form>
                        <div className="login-footer" style={{ display: "flex" }}>
                            <p ><Link to="/register" >Đăng ký</Link></p>
                            <p style={{ padding: "0 10px" }}>hoặc</p>
                            <p > <Link to="/login" >Đăng nhập</Link></p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default ForgotPassword;