import React, { PureComponent } from 'react';
import { Upload, Icon, message, Button } from 'antd';

class UploadXls extends PureComponent {

    handlerChange = ({ file, fileList }) => {
        const { status } = file.status;
        if (status !== 'uploading') {
            console.log(file, fileList);
        }
        if (status === 'done') {
            message.success(`${file.name} file uploaded successfully.`);
            console.log(file.response.data);
            // this.props.dispatch({
            //     type: 'drug2/setManualCN',
            //     payload: {
            //         manual_cn: file.response.data,
            //         _id: detail._id,
            //     },
            // });
        } else if (status === 'error') {
            message.error(`${file.name} file upload failed.`);
        }
    };

    render() {
        const { style, action } = this.props;
        return (
            <Upload
                name="file"
                action={action}
                onChange={this.handlerChange}
                style={style ? { ...style } : null}
                headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
            >
                <Button>
                    <Icon type="upload" /> 上传配置
                </Button>
            </Upload>
        );
    }
}

export default UploadXls;
