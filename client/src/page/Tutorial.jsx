import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import TitlePage from '../components/TitlePage';
import selecProductImg from "../assets/image/selecproduct.PNG"
import selecAddressImg from "../assets/image/selecaddress.PNG"
import selecPaymethodImg from "../assets/image/selecPaymethod.PNG"
function Tutorial(props) {
    return (
        <>
            <Header></Header>
            <TitlePage title="Hướng dẫn thanh toán" />
            <div className="tutorial">
                <div className="container">
                    <div className="tutorial-item">
                        {/* <h2>Hướng dẫn thanh toán</h2> */}
                        <div className="tutorial-content">
                            <h4>Bước 1:Chọn sản phẩm cần thanh toán </h4>
                            <img src={selecProductImg} alt="" />
                        </div>
                        <div className="tutorial-content">
                            <h4>Bước 2:Nhập địa chỉ nhận hàng nếu chưa có </h4>
                            <img src={selecAddressImg} alt=""/>
                        </div>
                        <div className="tutorial-content">
                            <h4>Bước 3:Chọn phương thức thanh toán</h4>
                            <img src={selecPaymethodImg} alt=""/>
                        </div>
                    </div>
                </div>

            </div>
            <Footer></Footer>
        </>
    );
}

export default Tutorial;