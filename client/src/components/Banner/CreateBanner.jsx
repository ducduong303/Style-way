import { Button, Modal, Table } from 'antd';
import moment from "moment";
import React, { useEffect, useState } from 'react';
import { RiAddLine } from 'react-icons/ri';
import http from '../../api/http';
import { ImageUpload } from '../../common/ImageUpload';
import Loading from '../../common/Loading';
import LoadingTable from '../../common/LoadingTable';
import { NotificationError, NotificationSuccess } from '../../common/Notification';
function CreateBanner(props) {

    const [loadingdata, setLoadingdata] = useState(false)
    const [dataSource, setDataSource] = useState([]);

    const fetChListBanner = async () => {
        setLoadingdata(true)
        const res = await http.get("/banner")
        if (res?.status === 200) {
            setLoadingdata(false)
            setDataSource(res?.data?.banner)
        }
    }
    useEffect(() => {
        fetChListBanner()
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
            title: 'Hình ảnh ',
            dataIndex: 'url',
            key: 'url',
            // sorter: true,
            // sorter: (a, b) => a.name.length - b.name.length,
            render: (url) => {
                return (
                    <img src={url} alt="" style={{ width: "450px", height: "200px" }} />
                )
            }
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => a.createdAt - b.createdAt,
            render: createdAt => {
                return (
                    <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
                )
            }
        },
        {
            title: "Thao tác",
            dataIndex: '',
            key: 'action',
            render: (item) => (
                <><Button onClick={() => handleDelete(item)}>Xóa</Button>
                </>
            )
        }
    ]

    const [currentBanner, setCurrentBanner] = useState({})
    const [isShowModalDelete, setIsShowModalDelete] = useState(false)
    const handleCloseModalDelete = () => {
        setIsShowModalDelete(false)
    }
    const handleDelete = (item) => {
        setIsShowModalDelete(true)
        setCurrentBanner(item)
    }
    const handleOk = async () => {
        const id = currentBanner._id;
        const public_id = currentBanner.public_id
        try {
            // setLoadingbanner(true)
            const res = await http.delete(`/banner/${id}`)
            if (res?.status === 200) {
                // setLoadingbanner(false)
                NotificationSuccess('', "Xóa thành công")
                handleCloseModalDelete()
                fetChListBanner()
            }
            await http.post("/image/destroy-image", {
                public_id: public_id
            })
        } catch (error) {
            console.log(error)
        }
    }

    const [loadingbaner, setLoadingbanner] = useState(false)
    const handleChangeImage = async (e) => {
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
        setLoadingbanner(true)
        let media = await ImageUpload(newImages)
        const res = await http.post("/banner", {
            public_id: media?.[0].public_id,
            url: media?.[0].url
        })
        if (res?.status === 200) {
            setLoadingbanner(false)
            NotificationSuccess("", "Thêm mới banner thành công")
            fetChListBanner()

        }
    }

    return (
        <>
            {
                loadingbaner ? <Loading></Loading> : null
            }
            <div className="container">
                <h2 className="title-screen">Banner</h2>
                <button className="btn-add" style={{ marginBottom: "10px" }}><label htmlFor="img-product"><RiAddLine size={20} />Thêm mới</label></button>
                <input type="file" id="img-product" onChange={handleChangeImage}></input>
                <Table
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    // rowSelection={rowSelection}
                    rowKey="_id"
                    loading={{
                        spinning: loadingdata,
                        indicator: <LoadingTable />
                    }}
                />
                <Modal
                    className='career-type-popup'
                    title={`Bạn có chắc chắn muốn xóa Banner này không ?`}
                    visible={isShowModalDelete}
                    onCancel={handleCloseModalDelete}
                >
                    <div className="career-btn">
                        <Button onClick={() => handleCloseModalDelete()} className="status-btn-default">
                            <span className="l-calendar-name">Không</span>
                        </Button>
                        <Button style={{ marginLeft: '20px' }} onClick={(record) => handleOk(record)} className="status-btn-default">
                            <span className="l-calendar-name">Có</span>
                        </Button>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default CreateBanner;