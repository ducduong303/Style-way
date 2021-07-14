import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import TitlePage from '../components/TitlePage';
import BlogItem from '../components/Blog/BlogItem';
import Footer from "../components/Footer";
import http from '../api/http';
import LoadingSection from '../common/LoadingSection';

function Blogger(props) {


    const [blogList, setBlogList] = useState([])

    const [loading, setLoading] = useState(false)


    const fechListBlogger = async () => {
        try {
            setLoading(true)
            const res = await http.get(`/blog`)
            if (res?.status === 200) {
                setLoading(false)
                setBlogList(res?.data?.blogs)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fechListBlogger()
    }, [])
    return (
        <>
            <Header></Header>
            <TitlePage title="Bài viết"></TitlePage>
            <div className="blogger">
                <div className="container ">
                    {
                        loading ? <LoadingSection /> : <div className="blogger-row">
                            {
                                blogList?.map((item, index) => {
                                    return (
                                        <BlogItem key={index} item={item}></BlogItem>
                                    )
                                })
                            }
                        </div>}


                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default Blogger;