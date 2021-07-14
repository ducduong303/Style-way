import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import http from '../../api/http';
import ProductItem from './ProductItem';
import { useSelector, useDispatch } from 'react-redux';
import LoadingSection from '../../common/LoadingSection';
function ProductSelling(props) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const fetChListSellingProduct = async () => {
        try {
            setLoading(true)
            const res = await http.get(`/products?sort=-sold&page=1&limit=8`)
            if (res?.status === 200) {
                setLoading(false)
                setProducts(res?.data?.products)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetChListSellingProduct()
        return () => {
            setProducts([])
        }
    }, [])
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        autoplay: false,
        className: "slides",
        autoplaySpeed: 2000,
        pauseOnHover: true,
        responsive: [

            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (

        <div className="selling-product">
            {
                loading ? <LoadingSection></LoadingSection> :
                    <Slider {...settings} >
                        {
                            products?.map((item, index) => {
                                return (
                                    <ProductItem noClass item={item} key={item._id}></ProductItem>
                                )
                            })
                        }
                    </Slider>
            }

        </div>
    );
}

export default ProductSelling;