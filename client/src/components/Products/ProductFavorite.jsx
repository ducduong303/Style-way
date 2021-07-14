import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import http from '../../api/http';
import LoadingSection from '../../common/LoadingSection';
import ProductItem from './ProductItem';

function ProductFavorite(props) {
    const [products, setProducts] = useState([])
    // const dispatch = useDispatch()
    // const products = useSelector(state => state.products)
    // const { productFavorite } = products;
    const [loading, setLoading] = useState(false)
    const fetChListProductFavorite = async () => {
        try {
            setLoading(true)
            const res = await http.get(`/products?sort=-rating&page=1&limit=8`)
            if (res?.status === 200) {
                setLoading(false)
                setProducts(res?.data?.products)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetChListProductFavorite()
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
        <div className="product-favorite">
            {
                loading ? <LoadingSection></LoadingSection> : <Slider {...settings} >
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

export default ProductFavorite;