import React, { PureComponent } from 'react';
import {
    Card,
    Button,
    Form,
    Icon,
    Col,
    Row,
    Radio,
    Input,
    Select,
    Popover,
    message,
} from 'antd';
import { connect } from 'dva';

import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import TableForm from './TableForm';
import Stage from './Stage';
import styles from '../../../Editor.less';

const { Option } = Select;

const fieldLabels = {
    name: '家具名称',
    des: '家具描述',
    asset: '家具素材',
    dirs: '家具方向',
};

// const tableData = [
//     {
//         key: '1',
//         workId: '00001',
//         name: 'John Brown',
//         department: 'New York No. 1 Lake Park',
//     },
//     {
//         key: '2',
//         workId: '00002',
//         name: 'Jim Green',
//         department: 'London No. 1 Lake Park',
//     },
//     {
//         key: '3',
//         workId: '00003',
//         name: 'Joe Black',
//         department: 'Sidney No. 1 Lake Park',
//     },
// ];

@connect(({ acheronFurniture }) => ({
    acheronFurniture,
}))
@Form.create()
class AdvancedForm extends PureComponent {
    state = {
        width: '100%',
        operation: 0,
        curDir: 3,
    };

    componentDidMount() {
        window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
        const {
            match: { params: { id } },
            dispatch,
        } = this.props;
        dispatch({
            type: 'acheronFurniture/detail',
            payload: { id },
            callback: isOK => {
                if (isOK) {
                    const { acheronFurniture: { detail }, form: { setFieldsValue } } = this.props;
                    setFieldsValue({
                        name: detail.name,
                        des: detail.des,
                        asset: detail.asset,
                        dirs: detail.dirs,
                    });
                }
            },
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeFooterToolbar);
        const { dispatch } = this.props;
        dispatch({
            type: 'acheronFurniture/clearDetail',
        });
    }

    handlePperationChange = ({ target: { value } }) => {
        this.setState({
            operation: value,
        });
    };

    handleDirChange = (value) => {
        this.setState({
            curDir: value,
        });
    };

    getErrorInfo = () => {
        const {
            form: { getFieldsError },
        } = this.props;
        const errors = getFieldsError();
        const errorCount = Object.keys(errors).filter(key => errors[key]).length;
        if (!errors || errorCount === 0) {
            return null;
        }
        const scrollToField = fieldKey => {
            const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
            if (labelNode) {
                labelNode.scrollIntoView(true);
            }
        };
        const errorList = Object.keys(errors).map(key => {
            if (!errors[key]) {
                return null;
            }
            return (
                <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
                    <Icon type="cross-circle-o" className={styles.errorIcon} />
                    <div className={styles.errorMessage}>{errors[key][0]}</div>
                    <div className={styles.errorField}>{fieldLabels[key]}</div>
                </li>
            );
        });
        return (
            <span className={styles.errorIcon}>
                <Popover
                    title="表单校验信息"
                    content={errorList}
                    overlayClassName={styles.errorPopover}
                    trigger="click"
                    getPopupContainer={trigger => trigger.parentNode}
                >
                    <Icon type="exclamation-circle" />
                </Popover>
                {errorCount}
            </span>
        );
    };

    resizeFooterToolbar = () => {
        requestAnimationFrame(() => {
            const sider = document.querySelectorAll('.ant-layout-sider')[0];
            if (sider) {
                const width = `calc(100% - ${sider.style.width})`;
                const { width: stateWidth } = this.state;
                if (stateWidth !== width) {
                    this.setState({ width });
                }
            }
        });
    };

    validate = () => {
        const {
            acheronFurniture: { detail: { _id } },
            form: { validateFieldsAndScroll },
            dispatch,
        } = this.props;
        validateFieldsAndScroll((error, values) => {
            if (!error) {
                // submit the values;
                dispatch({
                    type: 'acheronFurniture/update',
                    payload: {
                        ...values,
                        ...this._stage.newData,
                        id: _id,
                    },
                    callback: () => {
                        message.success('更新成功');
                    },
                });
            }
        });
    };

    render() {
        const {
            form: { getFieldDecorator, getFieldValue },
            acheronFurniture: { loading, detail },
        } = this.props;
        const { width, operation, curDir } = this.state;

        return (
            <PageHeaderWrapper
                title="家具编辑器"
                // content="高级表单常见于一次性输入和提交大批量数据的场景。"
                wrapperClassName={styles.advancedForm}
            >
                <Card title="基础数据" className={styles.card} bordered={false}>
                    <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                            <Col lg={6} md={12} sm={24}>
                                <Form.Item label={fieldLabels.name}>
                                    {getFieldDecorator('name', {
                                        rules: [{ required: true, message: `请输入${fieldLabels.name}` }],
                                    })(<Input placeholder={`请输入${fieldLabels.name}`} />)}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={12} sm={24}>
                                <Form.Item label={fieldLabels.des}>
                                    {getFieldDecorator('des', {
                                        rules: [{ required: true, message: `请输入${fieldLabels.des}` }],
                                    })(<Input placeholder={`请输入${fieldLabels.des}`} />)}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={12} sm={24}>
                                <Form.Item label={fieldLabels.asset}>
                                    {getFieldDecorator('asset', {
                                        rules: [{ required: true, message: `请输入${fieldLabels.asset}` }],
                                    })(<Input placeholder={`请输入${fieldLabels.asset}`} />)}
                                </Form.Item>
                            </Col>
                            <Col lg={6} md={12} sm={24}>
                                <Form.Item label={fieldLabels.dirs}>
                                    {getFieldDecorator('dirs', {
                                        rules: [{ required: true, message: `请输入${fieldLabels.dirs}` }],
                                    })(
                                        <Select>
                                            <Option value={2}>左下和右下</Option>
                                            <Option value={4}>所有的方向</Option>
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Card>
                <Card title="其他数据" className={styles.card} bordered={false}>
                    <Row type='flex' justify='space-between'>
                        <Radio.Group onChange={this.handlePperationChange} value={operation}>
                            <Radio value={0}>编辑偏移</Radio>
                            <Radio value={1}>编辑底面</Radio>
                            <Radio value={2}>触摸范围</Radio>
                        </Radio.Group>
                        <div>
                            当前方向
                            <Select value={curDir} style={{ width: '100px', marginLeft: '8px' }} onChange={this.handleDirChange}>
                                <Option value={3}>左下</Option>
                                {
                                    getFieldValue('dirs') === 4 && <Option value={7}>右上</Option>
                                }
                            </Select>
                        </div>
                    </Row>
                    {
                        detail && <Stage ref={c => this._stage = c} furniture={detail} operation={operation} curDir={curDir} />
                    }
                </Card>
                {/* <Card title="成员管理" bordered={false}>
                    {getFieldDecorator('members', {
                        initialValue: tableData,
                    })(<TableForm />)}
                </Card> */}
                <FooterToolbar style={{ width }}>
                    {this.getErrorInfo()}
                    <Button type="primary" onClick={this.validate} loading={loading}>
                        提交
                    </Button>
                </FooterToolbar>
            </PageHeaderWrapper>
        );
    }
}

export default AdvancedForm;
