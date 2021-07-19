import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import http from "../api/http";
// import LoadingSection from '../common/LoadingSection';
function Banner(props) {
    const data = [
        {
            url: "https://res.cloudinary.com/auth/image/upload/v1626721238/product/banner3_f5v2v2.jpg"
        }
    ]
    // const [loading, setLoading] = useState(false)
    const fetChListBanner = async () => {
        // setLoading(true)
        const res = await http.get("/banner");
        if (res?.status === 200) {
            // setLoading(false)
            if (res?.data?.banner?.length > 0) {
                setPhotoUrls([...photoUrls, ...res?.data?.banner])
            }
        }
    }
    useEffect(() => {
        fetChListBanner()
    }, [])
    const [photoUrls, setPhotoUrls] = useState(data);
    var settings = {
        dots: true,
        // fade: true,
        infinite: true,
        // infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        className: "slides",
        autoplay: true,
        autoplaySpeed: 5000
    };

    return (
        <>
            <div className="banner">
                <Slider {...settings}>
                    {
                        photoUrls && photoUrls.map((item, index) => {
                            // const styleBanner = {
                            //     backgroundImage: "url(" + item.url + ")"
                            // }
                            return (
                                <div className="banner__item" key={item}>
                                    <img src={item.url} alt="" style={{ maxHeight: "538px" }} />
                                </div>
                            )
                        })
                    }
                </Slider>
            </div>
        </>

    );
}

export default Banner;