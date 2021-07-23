import { Button, Form, Pagination, Table, Modal } from 'antd';
import moment from "moment";

import React, { useEffect, useState } from 'react';
import { RiAddLine } from 'react-icons/ri';

import { Link, useHistory } from 'react-router-dom';
import http from '../../api/http';
import LoadingSection from '../../common/LoadingSection';
import { NotificationSuccess } from "../../common/Notification"
function BlogManager(props) {

    const history = useHistory()
    const [form] = Form.useForm();
    const [loadingdata, setLoadingdata] = useState(false)
    const [dataSource, setDataSource] = useState([]);
    const [totalItem, setTotalItem] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const fetChBlogList = async (pageIndex) => {
        try {
            setLoadingdata(true)
            const res = await http.get(`/blog?page=${pageIndex}&limit=10`)
            if (res?.status === 200) {
                setLoadingdata(false)
                setDataSource(res?.data?.blogs)
                setTotalItem(res?.data?.totalItem)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetChBlogList(1)
    }, [])
    const columns = [
        {
            title: 'STT',
            dataIndex: '_id',
            key: '_id',
            render: (id, item, index) => {
                return (
                    <div>{index + 1}</div>
                )
            }

        },
        {
            title: 'Tên bài viết',
            dataIndex: 'hastag',
            key: 'hastag',

        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: createdAt => {
                return (
                    <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
                )
            }
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: updatedAt => {
                return (
                    <div>{moment(updatedAt).format('DD/MM/YYYY')}</div>
                )
            }
        },
        {
            title: "Thao tác",
            dataIndex: '',
            key: 'action',
            render: (item) => (
                <>
                    <Button onClick={() => handleEidtBlog(item)}>Sửa</Button>
                    {"  "}<Button onClick={() => handelDelete(item)}>Xóa</Button>
                </>
            )
        }
    ]
    const handleEidtBlog = (item) => {
        history.push(`/admin/edit-blog/${item._id}`)
    }
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const [currentBlog, setCurentBlog] = useState(null)
    const changePage = (page) => {
        fetChBlogList(page)
        setCurrentPage(page);
    }
    const handelDelete = (item) => {
        setCurentBlog(item)
        setIsShowModalDelete(true)
    }

    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false)
    }

    const handleOkDelete = async () => {
        const id = currentBlog._id;
        const url = `/blog/${id}`
        const idImage = currentBlog.images.map((item => item.public_id))
        idImage.forEach((item, index) => {
            const rs = http.post("/image/destroy-image", {
                public_id: item
            })
        })
        try {
            const res = await http.delete(url)
            if (res?.status === 200) {
                NotificationSuccess("", res.data.msg)
            }
            if (dataSource?.length === 1) {
                if (currentPage === 2 || currentPage === 1) {
                    changePage(1, null);
                    setIsShowModalDelete(false)
                    return;
                } else {
                    changePage(currentPage - 1, null);
                    setIsShowModalDelete(false)
                }
                return;
            } else {
                changePage(currentPage, null);
                setIsShowModalDelete(false)
            }

        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className="create-blog container">
            <h2 className="title-screen">Bài viết</h2>
            <button className="btn-add mb-3" >
                <RiAddLine size={20} /><Link to="/admin/create-blog" style={{ color: "#000000" }}>Thêm mới</Link></button>
            <Table
                dataSource={dataSource}
                pagination={false}
                columns={columns}
                scroll={{ x: true }}
                // rowSelection={rowSelection}
                rowKey="_id"
                loading={{
                    spinning: loadingdata,
                    indicator: <LoadingSection />
                }}
            />
            <Pagination className="pagination-custom"
                current={currentPage}
                defaultPageSize={10}
                total={totalItem}
                onChange={changePage}></Pagination>


            <Modal
                className='career-type-popup'
                title={`Bạn có chắc chắn muốn xóa bài viết này không?`}
                visible={isShowModalDelete}
                onCancel={handleCloseModalDelete}
            >
                <div className="career-btn">
                    <Button onClick={() => handleCloseModalDelete()} className="status-btn-default">
                        <span className="l-calendar-name">Không</span>
                    </Button>
                    <Button style={{ marginLeft: '20px' }} onClick={(record) => handleOkDelete(record)} className="status-btn-default">
                        <span className="l-calendar-name">Có</span>
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default BlogManager;