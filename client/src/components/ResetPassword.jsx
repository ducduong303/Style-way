import { Form, Input } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { ActResetPassword } from '../action/auth';
import imgLogin from "../assets/image/loginlogo.png";
import { NotificationError } from '../common/Notification';
import Header from './Header';
function ResetPassword(props) {
    const dispatch = useDispatch()
    const history = useHistory()
    const { token } = useParams()
    const [user, setUser] = useState({
        password: "",
        cf_password: ""
    })
    // const handleLoginSubmit = (e) => {
    //     e.preventDefault()
    //     if (!isMatch(user.password, user.cf_password)) {
    //         NotificationError("", "Mật khẩu không khớp")
    //         return;
    //     } else {
    //         dispatch(ActResetPassword(user.password, token))
    //         history.push("/login")
    //     }

    // }
    // const handleChangeInput = (e) => {
    //     const { name, value } = e.target
    //     setUser({
    //         ...user, [name]: value
    //     })
    // }
    // const isMatch = (password, cf_password) => {
    //     if (password === cf_password) return true
    //     return false
    // }

    const onFinish = (values) => {
        dispatch(ActResetPassword(values.password, token))
        history.push("/login")
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
                        <h3>Reset mật khẩu </h3>
                        <br></br>
                        <Form
                            name="basic"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            layout="vertical"
                            className="form"
                        >
                            <Form.Item
                                name="password"
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
                            // hasFeedback
                            >
                                <Input.Password
                                    placeholder="Nhập mật khẩu mới"
                                    style={{ borderRadius: '5px', padding: "8px" }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="cf_password"
                                label="Xác nhận mật khẩi"
                                dependencies={['password']}
                                hasFeedback
                                rules={[

                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value) {
                                                return Promise.reject(`Vui lòng xác nhận mật khẩu!`);
                                            }
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không trùng khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    placeholder="Xác nhận mật khẩu"
                                    style={{ borderRadius: '5px', padding: "8px" }}
                                />
                            </Form.Item>
                            <Form.Item >
                                <button className="btn-login"
                                    htmlType="submit">
                                    Reset mật khẩu
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
            {/* <div className="login-form">
                <form onSubmit={handleLoginSubmit}>
                    <h3>ResetPassword</h3>
                    <div className="form-gr">
                        <label>Password mới</label>
                        <input type="text"
                            name="password"
                            value={user.password}
                            onChange={handleChangeInput}
                            placeholder="Email....."></input>
                    </div>
                    <div className="form-gr">
                        <label>Confirm password</label>
                        <input type="text"
                            name="cf_password"
                            value={user.cf_password}
                            onChange={handleChangeInput}
                            placeholder="Email....."></input>
                    </div>
                    <button type="submit">Submit</button>
                </form>

                <h4>Nếu chưa có tài khoản vui lòng đăng ký <Link to="/register" >Đăng ký</Link></h4>
            </div> */}
        </>

    );
}

export default ResetPassword;