import React, { Component } from 'react';
import { connect } from 'react-redux';
import { find, propEq } from 'ramda';
import styled from 'styled-components';
import { Modal, Form, Input, Row, Col, Button, Select, Checkbox } from 'antd';

import { addManager, updateManager, deleteManager } from 'reducers/managers';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 12,
  },
};

const confirm = Modal.confirm;
const Option = Select.Option;
const FormItem = styled(Form.Item)`
  margin-bottom: 0px !important;
`;
const ColM = styled(Col)`
  text-align: center;
  &:nth-child(even) {
    background-color: #fafafa;
  }
  height: 36px;
`;

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  addManager,
  updateManager,
  deleteManager,
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class EditPermissionModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      manager: Object.assign(
        {
          managerFunctions: [],
          roles: [],
        },
        props.manager,
      ),
    };
  }

  validateName = (rule, val, callback) => {
    if (!val || val.length < 4) {
      return callback('帳號必須四字以上');
    }
    callback();
  };

  getFunction = (type) => {
    const func = find(propEq('function', type))(this.state.manager.managerFunctions);
    return func || {};
  };

  handleSave = () => {
    const { manager } = this.state;
    const {
      addManager,
      updateManager,
      form: { validateFields },
      onSave,
    } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      const data = {
        loginId: manager.memberId === values.memberId ? null : values.memberId, // duplicated -> null
        password: values.password || manager.password, // password is optional
        roleType: values.roles,
        memberFunctions: [
          {
            editable: values.editCard,
            function: 'CARD_MANAGEMENT',
            readable: values.editCard || values.readCard,
          },
          {
            editable: values.editMember,
            function: 'MEMBER_MANAGEMENT',
            readable: values.editMember || values.readMember,
          },
          {
            editable: values.editDevice,
            function: 'DEVICE_MANAGEMENT',
            readable: values.editDevice || values.readDevice,
          },
          {
            editable: values.editSystem,
            function: 'SYSTEM_MANAGEMENT',
            readable: values.editSystem || values.readSystem,
          },
        ],
      };

      let method = addManager;
      if (manager.id) {
        data.id = manager.id;
        method = updateManager;
      }

      onSave();
      method(data);
    });
  };

  handleDelete = () => {
    const { onSave, manager, deleteManager } = this.props;

    confirm({
      title: '確定要刪除此管理者',
      onOk() {
        deleteManager(manager.id);
        onSave();
      },
    });
  };

  render() {
    const {
      onClose,
      form: { getFieldDecorator },
    } = this.props;
    const { manager } = this.state;

    const footer = [
      <Button key="cancel" onClick={onClose}>
        取消
      </Button>,
      <Button key="save" type="primary" onClick={this.handleSave}>
        確認
      </Button>,
    ];

    if (manager.id) {
      footer.unshift(
        <Button key="delete" type="danger" style={{ float: 'left' }} onClick={this.handleDelete}>
          刪除此管理者
        </Button>,
      );
    }

    const cardFunc = this.getFunction('CARD_MANAGEMENT');
    const memberFunc = this.getFunction('MEMBER_MANAGEMENT');
    const deviceFunc = this.getFunction('DEVICE_MANAGEMENT');
    const systemFunc = this.getFunction('SYSTEM_MANAGEMENT');

    return (
      <Modal
        width="75%"
        title="編輯管理權限"
        visible={true}
        onOk={this.handleSave}
        onCancel={onClose}
        maskClosable={false}
        footer={footer}
        okText="確認"
        cancelText="取消">
        <Form hideRequiredMark>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="帳號" colon={false}>
                {getFieldDecorator('memberId', {
                  rules: [
                    { required: true, message: '輸入帳號', whitespace: true },
                    {
                      validator: this.validateName,
                    },
                  ],
                  initialValue: manager.memberId,
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="權限" colon={false}>
                {getFieldDecorator('roles', {
                  rules: [{ required: true, message: '選擇權限' }],
                  initialValue: manager.roles[0] ? String(manager.roles[0].id) : '1',
                })(
                  <Select placeholder="選擇權限">
                    <Option value="1">系統管理者</Option>
                    <Option value="2">副管理者</Option>
                    <Option value="3">一般管理者</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="密碼" colon={false}>
                {getFieldDecorator('password', {
                  rules: [{ required: manager.id ? false : true, message: '輸入密碼' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <ColM span={4} />
            <ColM span={4}>裝置管理</ColM>
            <ColM span={4}>用戶管理</ColM>
            <ColM span={4}>裝置管理</ColM>
            <ColM span={4}>系統管理</ColM>
            <ColM span={4} />
          </Row>

          <Row>
            <ColM span={4}>可編輯</ColM>
            <ColM span={4}>
              <FormItem>
                {getFieldDecorator('editCard', {
                  valuePropName: 'defaultChecked',
                  initialValue: !!cardFunc.editable,
                })(<Checkbox />)}
              </FormItem>
            </ColM>
            <ColM span={4}>
              <FormItem>
                {getFieldDecorator('editMember', {
                  valuePropName: 'defaultChecked',
                  initialValue: !!memberFunc.editable,
                })(<Checkbox />)}
              </FormItem>
            </ColM>
            <ColM span={4}>
              <FormItem>
                {getFieldDecorator('editDevice', {
                  valuePropName: 'defaultChecked',
                  initialValue: !!deviceFunc.editable,
                })(<Checkbox />)}
              </FormItem>
            </ColM>
            <ColM span={4}>
              <FormItem>
                {getFieldDecorator('editSystem', {
                  valuePropName: 'defaultChecked',
                  initialValue: !!systemFunc.editable,
                })(<Checkbox />)}
              </FormItem>
            </ColM>
            <ColM span={4} />
          </Row>

          <Row>
            <ColM span={4}>僅觀看</ColM>
            <ColM span={4}>
              <FormItem>
                {getFieldDecorator('readCard', {
                  valuePropName: 'defaultChecked',
                  initialValue: !!cardFunc.readable,
                })(<Checkbox />)}
              </FormItem>
            </ColM>
            <ColM span={4}>
              <FormItem>
                {getFieldDecorator('readMember', {
                  valuePropName: 'defaultChecked',
                  initialValue: !!memberFunc.readable,
                })(<Checkbox />)}
              </FormItem>
            </ColM>
            <ColM span={4}>
              <FormItem>
                {getFieldDecorator('readDevice', {
                  valuePropName: 'defaultChecked',
                  initialValue: !!deviceFunc.readable,
                })(<Checkbox />)}
              </FormItem>
            </ColM>
            <ColM span={4}>
              <FormItem>
                {getFieldDecorator('readSystem', {
                  valuePropName: 'defaultChecked',
                  initialValue: !!systemFunc.readable,
                })(<Checkbox />)}
              </FormItem>
            </ColM>
            <ColM span={4} />
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default EditPermissionModal;
