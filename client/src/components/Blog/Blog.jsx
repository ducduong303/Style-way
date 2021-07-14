import React, { useEffect, useState } from 'react';
import http from "../../api/http"
import BlogItem from './BlogItem';
import LoadingSection from '../../common/LoadingSection';
function Blog(props) {

    const data = [
        {
            hastag: "Chào ngày mới",
            url: "https://basel-cec2.kxcdn.com/basel/wp-content/uploads/2015/08/blog-new-17-1024x629.jpg",
            desc: "Ở tuổi 22, chúng ta ai cũng mang đầy hoài bão, căng tràn sức trẻ và nhiệt huyết. Ta muốn cống hiến, muốn nỗ lực để khẳng định bản thân.",
            createdAt: "2021-07-02T05:21:43.168Z"
        },
        {
            hastag: "hãy luôn yêu đời",
            url: "https://basel-cec2.kxcdn.com/basel/wp-content/uploads/2015/08/blog-new-1-1024x629.jpg",
            desc: "Ở tuổi 22, chúng ta ai cũng mang đầy hoài bão, căng tràn sức trẻ và nhiệt huyết. Ta muốn cống hiến, muốn nỗ lực để khẳng định bản thân.",
            createdAt: "2021-07-02T05:21:43.168Z"
        },
        {
            hastag: "cuộc sống tơi đẹp",
            url: "https://basel-cec2.kxcdn.com/basel/wp-content/uploads/2015/08/blog-new-photo-1-1024x629.jpg",
            desc: "Ở tuổi 22, chúng ta ai cũng mang đầy hoài bão, căng tràn sức trẻ và nhiệt huyết. Ta muốn cống hiến, muốn nỗ lực để khẳng định bản thân.",
            createdAt: "2021-07-02T05:21:43.168Z"

        },
        {
            hastag: "hãy hành động",
            url: "https://basel-cec2.kxcdn.com/basel/wp-content/uploads/2015/08/blog12-1.jpg",
            desc: "Ở tuổi 22, chúng ta ai cũng mang đầy hoài bão, căng tràn sức trẻ và nhiệt huyết. Ta muốn cống hiến, muốn nỗ lực để khẳng định bản thân.",
            createdAt: "2021-07-02T05:21:43.168Z"
        }
    ]
    const [blogs, setBlogs] = useState([])

    const [loading, setLoading] = useState(false)
    const fetChBlog = async () => {
        setLoading(true)
        const res = await http.get(`/blog?page=1&limit=4`)
        if (res?.status === 200) {
            setLoading(false)
            setBlogs(res?.data?.blogs)
        } else {
            setBlogs(data)
        }
    }

    useEffect(() => {
        fetChBlog()
    }, [])
    return (


        <div className="blog">
            {
                loading ? <LoadingSection /> : <div className="blog-container ">
                    {
                        blogs?.map((item, index) => {
                            return (
                                <BlogItem key={index} item={item}></BlogItem>
                            )
                        })
                    }
                </div>
            }

        </div>
    );
}

export default Blog;