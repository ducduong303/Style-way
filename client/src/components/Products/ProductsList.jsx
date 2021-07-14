import React, { useState } from 'react';
import ProductItem from './ProductItem';
import LoadingSection from '../../common/LoadingSection';


function ProductsList(props) {
    const { products, handleViewMore, loadingMore,status } = props;

    return (
        <>

            <div className="product-lists">
                <div className="product-item">
                    <div className="product-container ">

                        {
                            products?.map((item, index) => {
                                return (
                                    <ProductItem item={item} key={item._id} />
                                )
                            })
                        }
                        {
                            loadingMore ? <LoadingSection></LoadingSection> : null
                        }
                       
                    </div>
                    <button onClick={handleViewMore} className="view-more">{status ? "Xem thêm" : "Ẩn bớt"}</button>
                </div>
            </div>
        </>
    );
}

export default ProductsList;