import React from 'react';
import { Link } from 'react-router-dom';
function NotFound(props) {
    return (
        <section className="page_404">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 page_notfound">
                        <div className="col-sm-10 col-sm-offset-1 text-center" >
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">404</h1>
                            </div>

                            <div className="contant_box_404">
                                <h3 className="h2">
                                    Có vẻ như bạn đang bị lạc
		                        </h3>

                                <p>Trang bạn đang tìm kiếm không có sẵn</p>

                                <Link to="/"  className="link_404">Trở về trang chủ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default NotFound;