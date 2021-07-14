import { CameraOutlined, HomeOutlined, ScheduleOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useState } from 'react';
import { BsBook } from 'react-icons/bs';
import { GiEarthAmerica } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import logowhite from "../assets/image/logowhite.png";

const { Sider } = Layout;
function Sidebar(props) {
    // Xét trạng thái sidebar
    const bar = useSelector(state => state.bar)
    const { isBar } = bar


    const [collapsed, setCollapsed] = useState(false)
    const { SubMenu } = Menu;
    return (
        <Sider
            style={{
                // overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                // width: "265px"
            }}
            width={265}
            collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}
            className={`sidebar ${isBar ? "" : "Active-bar"}`}
        >
            <div className="sidebar">

                <div className="sidebar-container">
                    <div className="sidebarMenu">
                        <div className="sidebar-head">
                            <img src={logowhite} alt="" ></img>
                        </div>
                        {/* defaultSelectedKeys={['1']} */}
                        <Menu className=" active" mode="inline">
                            <Menu.Item key="11" icon={<HomeOutlined style={{ fontSize: "13px" }} />}>
                                <Link to="/admin">Trang chủ</Link>
                            </Menu.Item>
                            <SubMenu key="sub1" icon={<ShoppingCartOutlined />} title="Quản lý sản phẩm">
                                <Menu.Item key="1"><Link to="/admin/products">Tất cả sản phẩm</Link></Menu.Item>
                                <Menu.Item key="4"><Link to="/admin/create-product">Tạo mới sản phẩm</Link></Menu.Item>
                                <Menu.Item key="2"><Link to="/admin/size">Kích cỡ</Link></Menu.Item>
                                <Menu.Item key="3"><Link to="/admin/color">Màu sắc</Link></Menu.Item>
                            </SubMenu>
                            <Menu.Item key="12" icon={<UserOutlined />}>
                                <Link to="/admin/manager-user">Quản lý người dùng</Link>
                            </Menu.Item>
                            <Menu.Item key="13" icon={<ScheduleOutlined />}>
                                <Link to="/admin/oder-manager">Quản lý đơn hàng</Link>
                            </Menu.Item>
                            <Menu.Item key="14" icon={<CameraOutlined />}>
                                <Link to="/admin/create-banner">Quản lý banner</Link>
                            </Menu.Item>
                            <Menu.Item key="15" icon={<BsBook color="#a2a3b7" />}>
                                <Link to="/admin/blog">Quản lý bài viết</Link>
                            </Menu.Item>
                            <Menu.Item key="16" icon={<GiEarthAmerica color="#a2a3b7" />}>
                                <Link to="/">Quay trở lại trang web</Link>
                            </Menu.Item>
                        </Menu>

                        {/* <ul className="sidebarList">
                        <Link to="/" className="link">
                            <li className="sidebarList-item active" >
                                <AiOutlineDashboard className="sidebarIcon" size={20} /> Home
                            </li>
                        </Link>
                        <Link to="/product" className="link">
                            <li className={`sidebarList-item `} >
                                <AiOutlineDashboard className="sidebarIcon" size={20} />  Products
                        </li>
                        </Link>
                        <li className={`sidebarList-item `} >
                            <AiOutlineDashboard className="sidebarIcon" size={20} /> Comment
                        </li>
                    </ul> */}
                    </div>

                </div>

            </div>
        </Sider >
    );
}

export default Sidebar;