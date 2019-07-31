import React, { PureComponent } from 'react';
import { Upload, Icon, message } from 'antd';

class Upload2SM extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            imageUrl: props.imageUrl || null,
            imageWidth: props.imageWidth || 0,
            imageHeight: props.imageHeight || 0,
        };
    }

    // eslint-disable-next-line react/sort-comp
    beforeUpload = (file) => {
        const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isImage) {
            message.error('You can only upload image file!');
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            message.error('Image must smaller than 1MB!');
        }
        return isImage && isLt1M;
    };

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            // this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            const { code, data } = info.file.response;
            if (code === 'success') {
                const { url, width, height, filename } = data;
                // data:
                /*
                    delete: "https://sm.ms/delete/mx3Hte9Pz5QLwpD"
                    filename: "map001_37.png"
                    hash: "mx3Hte9Pz5QLwpD"
                    height: 80
                    ip: "114.84.149.170"
                    path: "/2019/02/26/5c74981031591.png"
                    size: 4477
                    storename: "5c74981031591.png"
                    timestamp: 1551144976
                    url: "https://i.loli.net/2019/02/26/5c74981031591.png"
                    width: 80
                */
                this.setState({
                    imageUrl: url,
                    imageWidth: width,
                    imageHeight: height,
                }, () => {
                    const { onUploaded } = this.props;
                    onUploaded && onUploaded(url, filename, width, height);
                });
            }
        }
    }

    render() {
        const { imageUrl, imageWidth, imageHeight } = this.state;
        let realImageWidth = imageWidth;
        let realImageHeight = imageHeight;
        if (imageUrl) {
            if (imageWidth > imageHeight) {
                if (imageWidth >= 100) {
                    realImageWidth = 100;
                    realImageHeight = realImageWidth / imageWidth * imageHeight;
                }
            } else if (imageHeight > 100) {
                realImageHeight = 100;
                realImageWidth = realImageHeight / imageHeight * imageWidth;
            }
        }
        return (
            <Upload
                name="smfile"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="/api/upload/"
                data={(file) => {
                    return { smfile: file, ssl: true };
                }}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
            >
                {
                    imageUrl ? <img src={imageUrl} alt="smfile" style={{ width: realImageWidth, height: realImageHeight }} /> : (
                        <div>
                            <Icon type='plus' />
                            <div className="ant-upload-text">Upload</div>
                        </div>
                    )
                }
            </Upload>
        );
    }
}

export default Upload2SM;
