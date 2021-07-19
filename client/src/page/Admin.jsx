import React from 'react';
import { useSelector } from 'react-redux';
// import FooterAdmin from '../components/FooterAdmin';
import Sidebar from "../components/Sidebar";
import TopBar from '../components/Topbar';
import MainAdmin from './MainAdmin';
function Admin(props) {

    const bar = useSelector(state => state.bar)
    const { isBar } = bar
    return (
        <div>
            {/* <Header></Header> */}
            <div className="containerAdmin">
                <Sidebar></Sidebar>
                <div className={`content ${isBar ? "" : "Active-content"}`}>
                    <TopBar></TopBar>
                    <MainAdmin></MainAdmin>
                    {/* <FooterAdmin></FooterAdmin> */}
                </div>

            </div>
        </div>
    );
}

export default Admin;