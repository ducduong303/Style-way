import React, { useState, useEffect } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { Link, useHistory } from 'react-router-dom';
import { Form, Row, Col, Input, Image } from 'antd';
import { NotificationError, NotificationSuccess } from '../../common/Notification';
import QuillResize from 'quill-resize-module';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ActCreateBlog, ActUpdateBlog } from '../../action/blog';
import http from '../../api/http';
import Loading from '../../common/Loading';
import { useDispatch } from 'react-redux';
Quill.register('modules/resize', QuillResize);

function CreateBlog(props) {

    const { match } = props;
    let id = match.params.id;
    const [form] = Form.useForm();
    const history = useHistory()
    const [images, setImages] = useState([])
    const [description, setDescription] = useState("");
    const [descErr, setDescErr] = useState("");
    const dispatch = useDispatch()

    const [blogEdit, setBlogEdit] = useState({})
    const fetChDetailBlog = async () => {
        try {
            const res = await http.get(`/blog/${id}`)
            if (res?.status === 200) {
                setBlogEdit(res?.data)
                setDescription(res?.data?.desc)
                setImages(res?.data?.images)
                form.setFieldsValue({
                    hastag: res.data.hastag,

                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (id) {
            fetChDetailBlog();
        }
    }, [id])
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
        resize: {
            // parchment: Quill.import('parchment'),

            modules: ['Resize', 'DisplaySize', 'Toolbar'],

        },

    }

    const handleChangeDesc = (html) => {
        // console.log("html", html)
        setDescription(html)
        setDescErr("")
    }
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


    const [loadingCr, setLoadingCr] = useState(false)
    const onFinish = async (values) => {
        if (description === "") {
            setDescErr("Vui lòng chọn ảnh đại diện cho bài viết")
            // NotificationError("", "Vui lòng nhập nội dung bài viết")
            return
        }
        if (images.length === 0) {
            NotificationError("", "Vui lòng chọn ảnh đại diện cho bài viết")
            return;
        }

        // console.log({
        //     description, hastag: values.hastag
        // })

        // let media = await ImageUpload(images)
        if (id) {
            console.log("update")
            // const res = await http.put(`/blog/${id}`, {
            //     images: media,
            //     desc: description,
            //     hastag: values.hastag
            // })
            // if (res?.status === 200) {
            //     setLoadingCr(false)
            //     NotificationSuccess("", "Cập nhật bài viết thành công")
            //     history.push('/admin/blog')
            // }
            setLoadingCr(true)
            dispatch(ActUpdateBlog({ images, desc: description, hastag: values.hastag ,blogEdit})).then(res => {
                setLoadingCr(false)
                NotificationSuccess("", "Cập nhật bài viết thành công")
                history.push('/admin/blog')
            })

        } else {
            setLoadingCr(true)
            dispatch(ActCreateBlog({ images, desc: description, hastag: values.hastag })).then(res => {
                setLoadingCr(false)
                NotificationSuccess("", "Thêm bài viết thành công")
                history.push('/admin/blog')
            })

        }


    }
    return (

        <>
            {
                loadingCr ? <Loading></Loading> : null
            }
            <div className="create-blog">
                <div className="container">
                    <h2 className="title-screen"><Link to="/admin/blog"><BiArrowBack size={20} /></Link>{id ? "Cập nhật bài viết" : "Tạo bài viết"}</h2>

                    <Form
                        layout="vertical"
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                    >
                        <Row >
                            <Col span={24} style={{ marginBottom: "5px" }}>
                                <Form.Item
                                    label="Tiêu đề (hastag)"
                                    name="hastag"
                                    // style={{ textAlign: "left" }}
                                    // value={inputColor.name}
                                    // onChange={(_) => handleChangeInput(_, "name")}
                                    rules={[
                                        () => ({
                                            validator(rule, value) {
                                                if (!value) return Promise.reject("Vui lòng nhập tiêu đề hastag cho bài viết!");
                                                if (value?.length > 50) return Promise.reject("Tên sản phẩm không được lớn hơn 50 ký tự");
                                                return Promise.resolve();
                                            }
                                        })
                                    ]}
                                >
                                    <Input placeholder="Nhập tiêu đề bài viết "
                                        style={{ borderRadius: '5px', padding: "8px" }} />
                                </Form.Item>
                            </Col>
                            <Col span={24} style={{ marginBottom: "25px" }}>
                                <div className="ant-col ant-form-item-label">
                                    <label>Nội dung</label>
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
                                {
                                    descErr && <p style={{ color: "red" }}>{descErr}</p>
                                }
                            </Col>
                            <Col span={24} style={{ marginBottom: "25px" }}>
                                <div className="ant-col ant-form-item-label">
                                    <label>Ảnh mô tả</label>
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
                            <Form.Item >
                                <button className="btn-Style"
                                    type="submit">
                                    {id ? "Chỉnh sửa" : "Tạo mới"}
                                </button>
                                <button className="btn-Style"
                                    style={{ marginLeft: "10px" }}
                                    type="button">
                                    <span><Link to="/admin/blog" style={{ color: "#fff" }}>Trở về</Link></span>
                                </button>
                            </Form.Item>
                        </Row>
                    </Form>

                </div>
            </div>
        </>
    );
}

export default CreateBlog;