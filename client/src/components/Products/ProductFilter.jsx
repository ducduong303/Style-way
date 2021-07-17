import { Menu, Pagination, Slider } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { BsFillGrid3X3GapFill } from 'react-icons/bs';
import { RiLayoutGridFill } from 'react-icons/ri';
import http from '../../api/http';
import LoadingSection from '../../common/LoadingSection';
import Footer from "../Footer";
import Header from "../Header";
import TitlePage from '../TitlePage';
import ProductItem from './ProductItem';
const { SubMenu } = Menu;
function ProductFilter(props) {

    const [categoryList, setCategoryList] = useState(null)
    const [sizeList, setSizeList] = useState(null)
    const [colorList, setColorList] = useState(null)

    const fetChListCategorys = async () => {
        try {
            const res = await http.get("/category")
            if (res?.status === 200) {
                setCategoryList(res?.data)
            }
        } catch (error) {
            console.log(error);

        }
    }
    const fetChListSizes = async () => {
        try {
            const res = await http.get("/size")
            if (res?.status === 200) {
                // console.log(res)
                setSizeList(res?.data?.sizes)
            }
        } catch (error) {
            console.log(error);

        }
    }
    const fetChListColors = async () => {
        try {
            const res = await http.get("/color")
            if (res?.status === 200) {
                setColorList(res?.data?.colors)

            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetChListCategorys()
        fetChListSizes()
        fetChListColors()
    }, [])


    const [products, setProducts] = useState(null)
    const [col, setCol] = useState("col-lg-4")
    const [colActive, setColActive] = useState(true)

    const [categoryIndex, setCategoryIndex] = useState("")
    const [sizeIndex, setSizeIndex] = useState("")
    const [colorIndex, setColorIndex] = useState("")
    const [loading, setLoading] = useState(false)


    const [categoryFill, setCategoryFill] = useState("")
    const [sizeFill, setSizeFill] = useState("")
    const [price, setPrice] = useState([0, 1000000])
    // const [priceFill, setPriceFill] = useState("")
    const [colorFill, setColorFill] = useState("")
    const [searchFill, setSearchFill] = useState("")
    const [sortFill, setSortFill] = useState("")

    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(1)
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    const fetChListProducts = async (pageIndex) => {
        try {
            setLoading(true)
            const res = await http.get(`/products?page=${pageIndex}&limit=${limit * 6}&category=${categoryFill}&sort=${sortFill}&keyword=${searchFill}&colors=${colorFill}&sizes=${sizeFill}&price[gte]=${price[0]}&price[lte]=${price[1]}`)
            if (res?.status === 200) {
                // console.log(res);
                setLoading(false)
                // window.scrollTo(0, 0)
                setProducts(res?.data?.products)
                setTotalItem(res?.data?.totalItem)
            }
        } catch (error) {
            console.log(error);
        }
    }
    const handleViewMore = () => {
        setLimit(limit + 1)
    }
    const changePage = (page) => {
        fetChListProducts(page)
        setCurrentPage(page);
    }
    useEffect(() => {
        fetChListProducts(1)
    }, [categoryFill, price, sizeFill, colorFill, searchFill, sortFill, limit])

    const handleChangeCategoryAll = () => {
        setCategoryIndex("")
        setCategoryFill('')
    }
    const handleChangeCategory = (item, index) => {
        setCategoryIndex(index)
        setCategoryFill(item._id)
    }

    const handleChangeSize = (item, index) => {
        setSizeFill(item.name)
        setSizeIndex(index)
    }

    const handleChangeColor = (item, index) => {
        setColorIndex(index)
        setColorFill(item.color)
    }

    const typingTimeoutRef = useRef(null);
    const handleSearch = (e) => {
        const value = e.target.value
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }
        typingTimeoutRef.current = setTimeout(async () => {
            setSearchFill(value)

        }, 300)
    }

    const typingTimeoutRefPrice = useRef(null);
    const onChangePrice = (value) => {
        if (typingTimeoutRefPrice.current) {
            clearTimeout(typingTimeoutRefPrice.current)
        }
        typingTimeoutRefPrice.current = setTimeout(async () => {
            setPrice(value)
            // setCallBack(!callBack)
        }, 300)
    }

    const handleSort = (e) => {
        setSortFill(e.target.value)
    }
    const handleSetCol = (col) => {
        if (col === 2) {
            setColActive(false)
            setCol("col-lg-6")
        } else {
            setColActive(true)
            setCol("col-lg-4")
        }

    }
    return (
        <>
            <Header></Header>
            <TitlePage title="Sản phẩm"></TitlePage>
            <div className="product-filter">
                <div className="container">
                    <div className="product-filter-box row">
                        <div className="product-filter-left col-lg-3">
                            <div className="filter-search">
                                <input type="text" onChange={handleSearch} placeholder="Nhập để tìm kiếm" name="" id="" />
                            </div>
                            <div className="filter-category">
                                <Menu
                                    // onClick={handleClick}
                                    // style={{ width: 256 }}
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    mode="inline"
                                >
                                    <SubMenu key="sub1" title="Loại hàng">
                                        <button className="category-item"
                                            style={{ border: categoryIndex === "" ? "1px solid red" : null }}
                                            onClick={handleChangeCategoryAll}
                                        >Tất cả</button>
                                        {
                                            categoryList?.map((item, index) => {
                                                return (
                                                    <button className="category-item"
                                                        style={{ border: categoryIndex === index ? "1px solid red" : null }}
                                                        onClick={() => handleChangeCategory(item, index)}
                                                    >{item.name}</button>
                                                )
                                            })
                                        }
                                    </SubMenu>
                                </Menu>
                            </div>
                            <div className="filter-price">
                                <Menu
                                    // onClick={handleClick}
                                    // style={{ width: 256 }}
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    mode="inline"
                                >
                                    <SubMenu key="sub1" title="Giá sản phẩm">
                                        <h4 ><span>Từ: {price[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span> - <span>{price[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ</span></h4>
                                        <Slider
                                            min={0}
                                            max={1000000}
                                            defaultValue={price}
                                            onChange={onChangePrice}
                                            range
                                            disabled={false}
                                            style={{ width: "100%" }}
                                            // tooltipVisible
                                            // tipFormatter={null}
                                             tipFormatter={value => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} VNĐ`}
                                        />
                                    </SubMenu>
                                </Menu>
                            </div>
                            <div className="filter-size">
                                <Menu
                                    // onClick={handleClick}
                                    // style={{ width: 256 }}
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub1']}
                                    mode="inline"
                                >
                                    <SubMenu key="sub1" title="Kích thước">
                                        {
                                            sizeList?.map((item, index) => {
                                                return (
                                                    <button
                                                        className="size-item"
                                                        style={{ border: sizeIndex === index ? "1px solid red" : null }}
                                                        onClick={() => handleChangeSize(item, index)}
                                                    >{item.name}</button>
                                                )
                                            })
                                        }
                                    </SubMenu>
                                </Menu>
                            </div>
                            <div className="filter-color">
                                <Menu
                                    // onClick={handleClick}
                                    // style={{ width: 256 }}
                                    defaultSelectedKeys={['1']}
                                    defaultOpenKeys={['sub3']}
                                    mode="inline"
                                >
                                    <SubMenu key="sub3" title="Màu sắc">
                                        {
                                            colorList?.map((item, index) => {
                                                return (
                                                    <button className="color-item"
                                                        onClick={() => handleChangeColor(item, index)}
                                                        style={{
                                                            background: item.color,
                                                            border: colorIndex === index ? "1px solid red" : null
                                                        }}
                                                    >{item.name}</button>
                                                )
                                            })
                                        }
                                    </SubMenu>
                                </Menu>
                            </div>
                        </div>
                        <div className="product-filter-right col-lg-9">
                            <div className="product-filter-container">
                                <div className="product-filter-head">
                                    <div className="filter-option">
                                        <select value={sortFill} onChange={handleSort}>
                                            <option value="">Sắp xếp</option>
                                            <option value="-sold">Sản phẩm bán chạy nhất</option>
                                            <option value="-rating">Sản phẩm yêu thích</option>
                                            <option value="-name">Tên sản phẩm A - Z</option>
                                            <option value="name">Tên sản phẩm Z - A</option>
                                            <option value="price">Giá từ thấp tới cao</option>
                                            <option value="-price">Giá từ cao tới thấp</option>

                                            {/* <option value="-price">Giá từ cao tới thấp</option> */}
                                        </select>
                                    </div>
                                    <div className="filter-col">
                                        <BsFillGrid3X3GapFill className={`icon-fill ${colActive ? "active" : null}`} onClick={() => handleSetCol(3)} size={25} />
                                        <RiLayoutGridFill className={`icon-fill ${!colActive ? "active" : null}`} onClick={() => handleSetCol(2)} size={30} />
                                    </div>

                                </div>
                                <div className="product-filter-content">
                                    {
                                        loading ? <LoadingSection height="300px" /> : products?.map((item, index) => {
                                            return (
                                                <>
                                                    <ProductItem col={col} item={item} key={item._id} />
                                                </>
                                            )

                                        })
                                    }
                                    {/* {
                                        totalItem > products?.length ? <button className="btn-Style" onClick={handleViewMore}>Xem thêm</button> : null
                                    } */}
                                    {
                                        products?.length === 0 && <h4 style={{ margin: "10rem auto" }}>Không có sản phẩm nào</h4>
                                    }


                                    {/* <Pagination className="pagination-custom"
                                        current={currentPage}
                                        defaultPageSize={6}
                                        // showQuickJumper
                                        total={totalItem}
                                        onChange={changePage}></Pagination> */}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default ProductFilter;