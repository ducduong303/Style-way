import React, { useState, useEffect } from 'react';
import Header from "../Header"
import Footer from '../Footer';
import http from '../../api/http';
import LoadingSection from '../../common/LoadingSection';
import moment from "moment";
import { Link } from 'react-router-dom';
function BlogDetail(props) {

    const { match } = props;
    const id = match.params.id

    const [loading, setLoading] = useState(false)
    const [blogDetail, setBlogDetail] = useState(null)


    const [blogRelated, setBlogRelate] = useState([])
    const [loadingRelated, setLoadingRelated] = useState(false)
    const fetChBlogRelated = async () => {
        try {
            setLoadingRelated(true)
            const res = await http.get(`/blog?page=1&limit=5`)
            if (res?.status === 200) {
                window.scrollTo(0, 0)
                setLoadingRelated(false)
                console.log(res)
                setBlogRelate(res?.data.blogs)
            }

        } catch (error) {
            console.log(error);
        }
    }

    const fetChBlogDetail = async () => {
        try {
            setLoading(true)
            const res = await http.get(`/blog/${id}`)
            if (res?.status === 200) {
                window.scrollTo(0, 0)
                setLoading(false)
                setBlogDetail(res?.data)
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetChBlogDetail()

    }, [id])
    useEffect(() => {
        fetChBlogRelated()
    }, [])

    return (
        <>
            <Header></Header>
            <div className="blog-detail">
                <div className="container">
                    <div className="blog-detailBox row">

                        <div className="blog-detailItem col-lg-8">
                            {
                                loading ? <LoadingSection height="250px"></LoadingSection> :
                                    <>
                                        <div className="blog-detailhead">
                                            <h2>Tiêu đề : <i>{blogDetail?.hastag}</i> </h2>
                                            <p>{moment(blogDetail?.createdAt).format('DD/MM/YYYY')}</p>
                                        </div>
                                        <div className="blog-detailImg">
                                            <img src={blogDetail?.images[0].url} alt=""></img>
                                        </div>

                                        <h4 dangerouslySetInnerHTML={{ __html: blogDetail?.desc }}></h4>
                                    </>
                            }

                        </div>
                        <div className="blog-related col-lg-3">
                            {
                                loadingRelated ? <LoadingSection height="250px"></LoadingSection> :
                                    <>
                                        <h2>Bài viết liên quan </h2>
                                        {
                                            blogRelated?.map((item, index) => {
                                                return (
                                                    <div key={index} className="blog-relatedItem">
                                                        <Link to={`/blogs/${item._id}`}> <img src={item.images[0].url} alt=""></img></Link>
                                                        <div className="blog-relatedDesc">
                                                            <h4> <Link to={`/blogs/${item._id}`}>{item.hastag.slice(0, 30)}...</Link></h4>
                                                            <p dangerouslySetInnerHTML={{ __html: `${item.desc.slice(0, 50)}... ` }}  ></p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </>
                            }



                        </div>
                    </div>

                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default BlogDetail;