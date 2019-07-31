import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Button,
    Modal,
    message,
    Popconfirm,
    Tooltip,
} from 'antd';
import Upload2SM from '@/components/Upload2SM';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import UploadXls from '@/components/UploadXls';

import styles from '../../List.less';

const FormItem = Form.Item;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

const CreateForm = Form.create()(props => {
    const { modalVisible, form, handleAdd, handleModalVisible } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
            destroyOnClose
            title="新建角色"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
                {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入至少一个字符的角色名称！', min: 1 }],
                })(<Input placeholder="请输入" />)}
            </FormItem>
        </Modal>
    );
});

/* eslint react/no-multi-comp:0 */
@connect(({ acheronRole }) => ({
    acheronRole,
}))
@Form.create()
class TableList extends PureComponent {
    state = {
        modalVisible: false,
        formValues: {},
    };

    columns = [
        {
            title: '名称',
            dataIndex: 'name',
            width: '160px',
            render: (text, record) => <Tooltip title={record.asset}><a onClick={() => this.previewItem(text)}>{text}</a></Tooltip>,
        },
        {
            title: '图片',
            dataIndex: 'imgUrl',
            render: (text, record) => (
                <Upload2SM
                    imageUrl={text}
                    imageWidth={record.imgWidth}
                    imageHeight={record.imgHeight}
                    onUploaded={(url, asset, width, height) => { this.handleUploaded(record._id, url, asset, width, height); }}
                />
            ),
        },
        {
            title: '操作',
            width: '120px',
            render: (_, record) => (
                <Fragment>
                    {/* <a>配置</a>
                    <Divider type="vertical" /> */}
                    <Popconfirm title="是否要删除此角色？" onConfirm={() => { this.handleDelete(record._id); }}>
                        <a href="">删除</a>
                    </Popconfirm>
                </Fragment>
            ),
        },
    ];

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'acheronRole/fetch',
        });
    }

    handleUploaded = (id, imgUrl, asset, imgWidth, imgHeight) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'acheronRole/update',
            payload: {
                id, imgUrl, imgWidth, imgHeight, asset
            },
        });
    };

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            page: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
            type: 'acheronRole/fetch',
            payload: params,
        });
    };

    handleExport = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'acheronRole/export',
        });
    };

    previewItem = id => {
        router.push(`/profile/basic/${id}`);
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        dispatch({
            type: 'acheronRole/fetch',
            payload: {},
        });
    };

    handleSearch = e => {
        e.preventDefault();

        const { dispatch, form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
                updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            this.setState({
                formValues: values,
            });

            dispatch({
                type: 'acheronRole/fetch',
                payload: values,
            });
        });
    };

    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    handleAdd = fields => {
        const { dispatch } = this.props;
        dispatch({
            type: 'acheronRole/add',
            payload: {
                name: fields.name,
            },
            callback: (isOK, msg) => {
                if (isOK) {
                    message.success('添加成功');
                    this.handleModalVisible();
                } else {
                    message.error(msg);
                }
            },
        });
    };

    handleDelete = id => {
        const { dispatch } = this.props;
        dispatch({
            type: 'acheronRole/delete',
            payload: {
                id,
            },
            callback: () => { },
        });
    }

    renderForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="角色名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    {/* <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col> */}
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                            </Button>
                            <Button shape="circle" icon="download" onClick={this.handleExport} style={{ marginLeft: 8 }} />
                            <UploadXls
                                style={{ marginLeft: 8 }}
                                action="/api/ganbare/acheron/role/xls"
                            />
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    render() {
        // eslint-disable-next-line react/destructuring-assignment
        console.log(this.props.acheronRole.listData.list);
        const {
            acheronRole: { listData, loading },
        } = this.props;
        const { modalVisible } = this.state;

        return (
            <PageHeaderWrapper title="角色列表">
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                                新建
                            </Button>
                        </div>
                        <StandardTable
                            loading={loading}
                            data={listData}
                            columns={this.columns}
                            // onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                <CreateForm
                    handleAdd={this.handleAdd}
                    handleModalVisible={this.handleModalVisible}
                    modalVisible={modalVisible}
                />
            </PageHeaderWrapper>
        );
    }
}

export default TableList;
