import React, { useEffect, useState } from 'react';
import http from '../api/http';
import LoadingSection from '../common/LoadingSection';
import Banner from '../components/Banner';
// import Blog from '../components/Blog';
import ProductFavorite from '../components/Products/ProductFavorite';
import ProductSelling from '../components/Products/ProductSelling';
import ProductsList from '../components/Products/ProductsList';
import TitleSection from '../components/TitleSection';
import Blog from '../components/Blog/Blog';
import ProductSale from '../components/Products/ProductSale';


function Home(props) {
    const [products, setProducts] = useState([])
    // const dispatch = useDispatch()
    // const StatusLoading = useSelector(state => state.products)
    // const { productList } = StatusLoading;

    const [loading, setLoading] = useState(false)
    const [number, setNumber] = useState(8)
    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await http.get(`/products?page=1&limit=${number}`)
            if (res?.status === 200) {
                setLoading(false)
                setProducts(res?.data?.products)

            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
        window.scrollTo(0, 0)
    }, [])

    const [loadingMore, setLoadingMore] = useState(false)
    const [status, setStatus] = useState(true)
    const handleViewMore = async (num) => {
        let url;
        if (status) {
            url = `/products?page=1&limit=${12}`
        } else {
            url = `/products?page=1&limit=${8}`
        }
        setLoadingMore(true)
        try {
            const res = await http.get(url)
            if (res?.status === 200) {
                setProducts(res?.data?.products)
                setLoadingMore(false)
                if (status) {
                    setStatus(false)
                } else {
                    setStatus(true)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            {/* <Header></Header> */}
            <Banner></Banner>
            <div className="Home-user">
                <div className="container">
                    <TitleSection title="Sản phẩm mới nhất"></TitleSection>
                    {
                        loading ? <LoadingSection></LoadingSection> : <ProductsList status={status} loadingMore={loadingMore} handleViewMore={handleViewMore} products={products}></ProductsList>
                    }
                     <TitleSection title="Sản phẩm khuyến mãi"></TitleSection>
                     <ProductSale></ProductSale>
                    <TitleSection title="Sản phẩm được yêu thích "></TitleSection>
                    <ProductFavorite></ProductFavorite>
                    <TitleSection title="Sản phẩm bán chạy"></TitleSection>
                    <ProductSelling></ProductSelling>
                    <TitleSection title="Bài viết nổi bật"></TitleSection>
                    <Blog></Blog>
                

                </div>
            </div>


        </>
    );
}

export default Home;