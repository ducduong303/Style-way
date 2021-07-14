import React, { useEffect, useState } from 'react';
import TitleSection from '../TitleSection';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import http from '../../api/http';
import ProductItem from './ProductItem';
import LoadingSection from '../../common/LoadingSection';
function ProductRelated({ category }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const fetChListProductFavorite = async () => {
        try {
            setLoading(true)
            const res = await http.get(`/products?category=${category}&page=1&limit=8`)
            if (res?.status === 200) {
                setLoading(false)
                setProducts(res?.data?.products)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (category) {
            fetChListProductFavorite()
        }
        return () => {
            setProducts([])
        }
    }, [category])
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

    const checkClass = products.length <= 4 ? "product-related" : "product-favorite";
    const render = () => {
        let html;
        if (products.length <= 4) {
            html = (

                <div className="product-lists">
                    <div className="product-item">
                        <div className="product-container ">
                            {
                                products?.map((item, index) => {
                                    return (
                                        <ProductItem item={item} key={item._id}></ProductItem>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            )

        } else {
            html = <Slider {...settings} >
                {
                    products?.map((item, index) => {
                        return (
                            <ProductItem noClass item={item} key={item._id}></ProductItem>
                        )
                    })
                }
            </Slider>
        }
        return html
    }
    return (
        <div>
            <TitleSection title="Sản phẩm liên quan"></TitleSection>
            <div className={checkClass}>
                {/* {
                    loading ? <LoadingSection></LoadingSection> : <Slider {...settings} >
                        {
                            products?.map((item, index) => {
                                return (
                                    <ProductItem noClass item={item} key={item._id}></ProductItem>
                                )
                            })
                        }
                    </Slider>
                } */}
                {
                    loading ? <LoadingSection></LoadingSection> : render()
                }
            </div>
        </div>
    );
}

export default ProductRelated;