import { Form, Input } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from 'react-router-dom';
import { ActLogin } from "../action/auth";
import imgLogin from "../assets/image/loginlogo.png";
import { NotificationError, NotificationSuccess } from '../common/Notification';
import Header from '../components/Header';
import * as Type from "../contants/Actiontype";
function Login(props) {
    const dispatch = useDispatch()
    const history = useHistory()
    const auth = useSelector(state => state.auth)
    const { isLogger } = auth;

    useEffect(() => {
        if (isLogger) {
            history.push("/")
        }
    }, [isLogger])

    // const [user, setUser] = useState({
    //     email: "",
    //     password: ""
    // })
    // const handleLoginSubmit = (e) => {
    //     e.preventDefault();
    //     dispatch(ActLogin(user))

    // }
    // const handleChangeInput = (e) => {
    //     const { name, value } = e.target;
    //     setUser({ ...user, [name]: value })
    // }

    const responseGoogle = async (response, err) => {
        try {
            const res = await axios.post("/user/google_login", {
                tokenId: response.tokenId
            })
            // console.log(res)
            NotificationSuccess("", res.data.msg)
            localStorage.setItem("isLogin", true)
            // localStorage.setItem("refresh_token", res.data.refresh_token)
            dispatch({
                type: Type.LOGIN_SUCCESS,
            })
            history.push("/")
        } catch (error) {
            console.log(error)
            NotificationError("", error?.msg)
        }
    }
    const responseFacebook = async (response) => {
        console.log(response);
        try {
            const { userID, accessToken } = response
            const res = await axios.post("/user/facebook_login", {
                userID, accessToken
            })
            NotificationSuccess("", res.data.msg)
            localStorage.setItem("isLogin", true)
            // localStorage.setItem("refresh_token", res.data.refresh_token)

            dispatch({
                type: Type.LOGIN_SUCCESS,
            })
            history.push("/")
        } catch (error) {
            NotificationError("", error.response?.data?.msg)
        }
    }

    const onFinish = (values) => {
        dispatch(ActLogin(values))
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Header></Header>
            <div className="login-form col-lg-8">
                <div className="login-left col-lg-6">
                    <img src={imgLogin} alt=""></img>
                </div>
                <div className="login-rigth col-lg-6">
                    <h3>Đăng nhập ngay </h3>
                    <div className="login-social">
                        <GoogleLogin
                            className="btn-google"
                            clientId="615453405705-ua3dcc196ek8f4blvvvnbrqbtsqf8c9s.apps.googleusercontent.com"
                            buttonText="Đăng nhập với google"
                            onSuccess={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                        <FacebookLogin
                            className="btn-face"
                            appId="190840929469321"
                            textButton="Đăng nhập với facebook"
                            autoLoad={false}
                            icon="fa-facebook"
                            fields="name,email,picture"
                            callback={responseFacebook} />
                    </div>
                    <div className="or">
                        <span></span>
                        <h4>hoặc</h4>
                        <span></span>
                    </div>
                    {/* <form onSubmit={handleLoginSubmit}>
                        <div className="form-gr">
                            <label>Emaill</label>
                            <input type="text"
                                name="email"
                                value={user.email}
                                onChange={handleChangeInput}
                                placeholder="Email....."></input>
                        </div>
                        <div className="form-gr">
                            <label>Password</label>
                            <input type="password"
                                name="password"
                                value={user.password}
                                onChange={handleChangeInput}
                                placeholder="Password....."></input>
                        </div>

                        <button type="submit">Đăng nhập</button>
                    </form> */}

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
                                Đăng nhập
                            </button>
                        </Form.Item>
                    </Form>
                    <div className="login-footer">
                        <p >Nếu chưa có tài khoản vui lòng <Link to="/register" >Đăng ký</Link></p>
                        <p> <Link to="/forgot-password" >Quên mật khẩu</Link></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;