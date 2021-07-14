import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TitlePage from '../components/TitlePage';


function Contact(props) {

    const render = () => {
        const iframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59479.797356700474!2d106.15511537362269!3d21.291751603138984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31356dadb70fbfe5%3A0xd6dbe565b8b15e5c!2zVHAuIELhuq9jIEdpYW5nLCBC4bqvYyBHaWFuZywgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1625537598894!5m2!1svi!2s" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
        return (
            <div>
                <div dangerouslySetInnerHTML={{ __html: iframe }} />
            </div>
        );
    }
    return (
        <>
            <Header />
            {
                render()
            }
            <div className="contact">
                <div className="container">
                    <div className="contact-box">
                        <div className="contact-left col-lg-6">
                            <h2>Thông tin liên hệ</h2>
                            <h4>Địa chỉ: Xuân Hương, Lạng Giang, Bắc Giang</h4>
                            <h4>Số điện thoại: 0375530760</h4>
                            <h4>Email: dduc1445@gmail.com</h4>
                        </div>
                        <div className="contact-right col-lg-6">
                            <form>
                                <div className="form-gr">
                                    <input type="text" placeholder="Tên người dùng" />
                                    <input type="text" placeholder="Email người dùng" />
                                </div>
                                <div className="form-mess">
                                    <textarea name=""
                                        placeholder="Nhập nội dung"
                                        id="" cols="30"
                                        rows="10"></textarea>
                                </div>
                                <button className="btn-Style">Gửi phản hồi</button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default Contact;