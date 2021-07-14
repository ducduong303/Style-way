import { Col, Form, Image, Input, Row, Select } from 'antd';
import QuillResize from 'quill-resize-module';
import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';
import { BiArrowBack } from 'react-icons/bi';
// ReactQill
// import ReactQuill, { Quill } from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import ImageResize from 'quill-image-resize-module-react';
// Quill.register('modules/imageResize', ImageResize);

import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { ActChangePage, ActCreateProduct, ActUpdateProduct } from "../../action/product";
import http from '../../api/http';
import Loading from "../../common/Loading";
import { NotificationError, NotificationSuccess } from '../../common/Notification';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
Quill.register('modules/resize', QuillResize);
// import ImageResize from 'quill-image-resize-module-react';
// Quill.register('modules/imageResize', ImageResize);
const { Option } = Select;

function CreateProduct(props) {

    const [form] = Form.useForm();
    const { match } = props;
    let id = match.params.id;
    const [productEdit, setProductEdit] = useState({})

    const handleDetail = async () => {
        try {
            const res = await http.get(`/products/${id}`)
            // console.log("ress", res);
            setProductEdit(res.data)
            setImages(res.data.images)
            setDescription(res.data.description)
            // setTitle(res.data.name)
            // setPrice(res.data.price)
            // setSizes(res.data.sizes)
            setColors(res.data.colors)
            // setCountInStock(res.data.countInStock)
            // setCategoryValue(res.data.category)
            form.setFieldsValue({
                title: res.data.name,
                category: res.data.category,
                sizes: res.data.sizes,
                price: res.data.price,
                countInStock: res.data.countInStock
            })

        } catch (error) {
            console.log(error);
        }
    }

    const [images, setImages] = useState([])
    const dispatch = useDispatch()
    const history = useHistory()
    const auth = useSelector(state => state.auth)

    const handleChangeImage = (e) => {
        const fileArr = [...e.target.files]
        let newImages = [];

        fileArr.forEach(file => {
            if (!file) {
                NotificationError("", "Chưa chọn file")
                return
            }
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                NotificationError("", "File không đúng định dạng")
                return;
            }
            return newImages.push(file)
        })
        setImages([...images, ...newImages])
    }
    const handleDeletePreview = (index) => {
        const cloneData = [...images]
        cloneData.splice(index, 1)
        setImages(cloneData)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (images.length === 0) {
            NotificationError("", "Vui lòng chọn ảnh")
            return;
        }
        if (!price) {
            NotificationError("", "Vui lòng nhập giá tiền")
            return;
        }

        // if (id) {
        //     dispatch(ActUpdateProduct({
        //         name: title, description,
        //         images, productEdit, category: categoryValue,
        //         sizes, price, colors, countInStock
        //     })).then(res => {
        //         NotificationSuccess("", "Update Thành công")
        //         dispatch({ type: Type.REMOVE_LOADING })
        //         history.push('/products')
        //     })
        // } else {
        //     dispatch(ActCreateProduct({
        //         name: title, description,
        //         images, category: categoryValue, sizes,
        //         colors, price, countInStock
        //     })).then(res => {
        //         NotificationSuccess("", res?.data.msg)
        //         dispatch({ type: Type.REMOVE_LOADING })
        //         history.push('/admin/products')
        //     })
        // }

    }


    // Content Editor
    // Content Editor
    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ]
    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' },
            { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
        // clipboard: {
        //     // toggle to add extra line breaks when pasting HTML:
        //     matchVisual: false,
        // },
        resize: {
            // parchment: Quill.import('parchment'),

            modules: ['Resize', 'DisplaySize', 'Toolbar'],

        },
        // history: {
        //     delay: 1000,
        //     maxStack: 50,
        //     userOnly: false
        // },
        // imageResize: {
        //     parchment: Quill.import('parchment'),
        //     modules: ['Resize', 'DisplaySize']
        // },

    }

    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [sizes, setSizes] = useState([]);
    const [sizeList, setSizeList] = useState([]);
    const [category, setCategory] = useState([]);
    const [price, setPrice] = useState("");
    const [colorLists, setColorLists] = useState([]);
    const [colors, setColors] = useState([]);
    const [countInStock, setCountInStock] = useState("")

    const handleChangeTitle = (e) => {
        setTitle(e.target.value)
    }
    const handleChangeDesc = (html) => {
        // console.log("html", html)
        setDescription(html)
    }
    const handleChangeStock = (e) => {
        setCountInStock(e.target.value)
    }


    const handleChangeSize = async (value) => {
        setSizes(value)
    }

    const handleChangePrice = (e) => {
        if (e.floatValue) {
            if (e.floatValue > 0) {
                setPrice(e.floatValue)
            } else {
                NotificationError("", "Vui lòng nhập giá tiền lớn hơn 0")
            }
        }
    }

    const handleChangeColor = (value) => {
        let arr = []

        for (let i = 0; i < colorLists.length; i++) {
            for (let j = 0; j < value.length; j++) {
                if (colorLists[i].color === value[j]) {
                    arr.push({
                        name: colorLists[i].name,
                        color: colorLists[i].color
                    })
                }
            }
        }
        setColors(arr)
    }

    const [categoryValue, setCategoryValue] = useState("")
    const handleChangeCategory = (value) => {
        // console.log("value", value)
        setCategoryValue(value)
    }

    useEffect(() => {
        const fetChCategory = async () => {
            const rs = await http.get("/category")
            if (rs?.status === 200) {
                setCategory(rs?.data)
            }
        }
        fetChCategory()
    }, [])
    useEffect(() => {
        const fetChSizes = async () => {
            const rs = await http.get("/size")
            if (rs?.status === 200) {
                setSizeList(rs?.data?.sizes)
            }
        }
        fetChSizes()
    }, [])
    useEffect(() => {
        const fetChColors = async () => {
            const rs = await http.get("/color")
            if (rs?.status === 200) {
                setColorLists(rs?.data?.colors)
            }
        }
        fetChColors()
    }, [])
    useEffect(() => {
        if (id) {
            handleDetail();
        }
    }, [id])

    const handleBack = () => {
        dispatch(ActChangePage(1))
    }


    const [loadingCr, setLoadingCr] = useState(false)
    const onFinish = (values) => {
        if (images.length === 0) {
            NotificationError("", "Vui lòng chọn ảnh")
            return;
        }
        // if (description === "") {
        //     NotificationError("", "Vui lòng mô tả sản phẩm")
        //     return;
        // }
        if (id) {
            setLoadingCr(true)
            dispatch(ActUpdateProduct({
                name: values.title, description,
                images, productEdit, category: values.category,
                sizes, price: price, colors, countInStock: values.countInStock
            })).then(res => {
                NotificationSuccess("", "Update Thành công")
                // dispatch({ type: Type.REMOVE_LOADING })
                setLoadingCr(false)
                history.push('/admin/products')
            })
        } else {
            setLoadingCr(true)
            dispatch(ActCreateProduct({
                name: values.title, description,
                images, category: values.category,
                sizes, price: price, colors, countInStock: values.countInStock
            })).then(res => {
                setLoadingCr(false)
                NotificationSuccess("", res?.data.msg)
                // dispatch({ type: Type.REMOVE_LOADING })
                history.push('/admin/products')
            })
        }

    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    return (
        <>
            {
                loadingCr ? <Loading></Loading> : null
            }
            <div className="container">
                <h2 className="title-screen "><Link to="/admin/products"><BiArrowBack size={20} /></Link>{id ? "Cập nhật sản phẩm" : "Tạo mới sản phẩm "}</h2>
                {/* <button onClick={handleBack}></button> */}
                <Form
                    name="basic"
                    onFinish={onFinish}
                    form={form}
                    layout="vertical"
                    className="form"
                >
                    <Row gutter={[8, 16]} style={{ margin: "1rem 0" }} justify="space-between">
                        <Col span="6">
                            <Form.Item
                                label="Tên sản phẩm"
                                name="title"
                                rules={[
                                    () => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("Vui lòng nhập Tên sản phẩm!");
                                            // const regExp = /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\_|\d/;
                                            // if (regExp.test(value)) return Promise.reject("Tên sản phẩm sai định dạng")
                                            if (value?.length > 255) return Promise.reject("Tên sản phẩm không được lớn hơn 255 ký tự");
                                            return Promise.resolve();
                                        }
                                    })
                                ]}
                            >
                                <Input
                                    // value={title}
                                    placeholder="Nhập tên sản phẩm "
                                    style={{ borderRadius: '5px', padding: "8px" }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span="6">
                            <Form.Item
                                label="Giá sản phẩm"
                                name="price"
                                rules={[
                                    () => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("Vui lòng nhập giá sản phẩm!");
                                            return Promise.resolve();
                                        }
                                    })
                                ]}
                            >
                                <NumberFormat
                                    customInput={Input}
                                    placeholder="Giá tiền"
                                    thousandSeparator={true}
                                    onValueChange={(_) => handleChangePrice(_)}
                                    className="input-price"
                                    value={price}
                                    style={{ borderRadius: '5px', padding: "8px", width: "100%" }}
                                />

                            </Form.Item>
                        </Col>
                        <Col span="6">
                            <Form.Item
                                label="Loại sản phẩm"
                                name="category"
                                rules={[
                                    () => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("Vui lòng nhập category!");
                                            return Promise.resolve();
                                        }
                                    })
                                ]}
                            >
                                <Select placeholder="Chọn category" value={categoryValue ? categoryValue : "Chọn category"} onChange={handleChangeCategory}>
                                    {
                                        category?.map((item) => {
                                            return (
                                                <Option key={item._id} value={item._id}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 16]} style={{ margin: "1.5rem 0" }} justify="space-between">
                        <Col span="6">
                            <Form.Item
                                label="Kích thước"
                                name="sizes"
                            >
                                <Select
                                    mode="multiple"
                                    className="add-size"
                                    style={{ width: '100%' }}
                                    placeholder="Vui lòng chọn size"
                                    value={sizes}
                                    onChange={handleChangeSize}
                                >
                                    {
                                        sizeList?.map((item, index) => {
                                            return (
                                                <Option key={item._id}
                                                    value={item.name}>{item.name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span="6">
                            <div className="ant-col ant-form-item-label">
                                <label>Màu sắc</label>
                            </div>
                            <Select
                                className="add-color"
                                mode="tags"
                                style={{ width: '100%' }}
                                placeholder="Vui lòng chọn màu"
                                value={colors ? colors?.map((item) => item.color) : null}
                                onChange={handleChangeColor}

                            >
                                {
                                    colorLists?.map((item, index) => {
                                        return (
                                            <Option key={item._id}
                                                value={item.color} >
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <span style={{ backgroundColor: item.color, height: "20px", width: "20px", display: "inline-block", marginRight: "5px" }}></span><label>{item.name}</label>
                                                </div>
                                            </Option>
                                        )
                                    })
                                }
                            </Select>

                        </Col>

                        <Col span="6">
                            <Form.Item
                                label="Số lượng sản phẩm"
                                name="countInStock"
                                rules={[
                                    () => ({
                                        validator(rule, value) {
                                            if (!value) return Promise.reject("Vui lòng nhập số lượng sản phẩm!");
                                            return Promise.resolve();
                                        }
                                    })
                                ]}
                            >
                                <Input placeholder="Nhập số lượng sản phẩm "
                                    style={{ borderRadius: '5px', padding: "8px" }}
                                >
                                </Input>

                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ margin: "1.5rem 0" }}>
                        <Col span="24">
                            <div className="ant-col ant-form-item-label">
                                <label>Mô tả</label>
                            </div>
                            <ReactQuill
                                theme="snow"
                                onChange={handleChangeDesc}
                                value={description}
                                modules={modules}
                                formats={formats}
                                bounds={'.app'}
                                placeholder="Viết cái gì đó"
                            />
                        </Col>
                    </Row>
                    <Row style={{ margin: "1.5rem 0" }}>
                        <Col span="24">
                            <div className="ant-col ant-form-item-label">
                                <label>Hình ảnh sản phẩm</label>
                            </div>
                            <div className="product-box">
                                <div className="img-box">
                                    <label className="upload" htmlFor="img-product">
                                        <span>Upload +</span>
                                    </label>
                                    {
                                        images?.map((item, index) => {
                                            return (
                                                <div key={index} className="img-preview">
                                                    <Image
                                                        src={item.url ? item.url : URL.createObjectURL(item)}
                                                        alt=""
                                                    >
                                                    </Image>
                                                    <span className="deletePreview" onClick={() => handleDeletePreview(index)}>&times;</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <input type="file" id="img-product" accept="image/*" multiple onChange={handleChangeImage} />
                            </div>
                        </Col>
                    </Row>
                    <Form.Item >
                        <button className="btn-Style"
                            type="submit">
                            {id ? "Chỉnh sửa" : "Tạo mới"}
                        </button>
                        <button className="btn-Style"
                            style={{ marginLeft: "10px" }}
                            type="button">
                            <span><Link to="/admin/products" style={{ color: "#fff" }}>Trở về</Link></span>
                        </button>
                    </Form.Item>
                </Form>

            </div >
        </>
    );
}

export default CreateProduct;