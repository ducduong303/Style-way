import React from 'react';
import moment from "moment";
import { Link } from 'react-router-dom';
function BlogItem({ item }) {

    return (
        <div className="col-lg-3 blog-box">
            <div className="blog-item">
                <div className="blog-img">
                    <Link to={`/blogs/${item._id}`}> <img src={item.images[0].url} alt="" /></Link>
                </div>
                <div className="blog-title">
                    <h4> <Link to={`/blogs/${item._id}`} style={{ color: "#000000" }}>{item.hastag}</Link></h4>
                    <span>{moment(item.createdAt).format('DD/MM/YYYY')}</span>
                </div>
                <h5 className='blog-desc' dangerouslySetInnerHTML={{ __html: `${item.desc.slice(0, 50)}...` }} />

            </div>
        </div>
    );
}
export default BlogItem;