import React, { Component } from 'react';
import { connect } from 'react-redux';
import { find, propEq } from 'ramda';
import styled from 'styled-components';
import { Modal, Form, Input, Row, Col, Button, Checkbox, Select } from 'antd';

import { addManager, updateManager, deleteManager } from 'reducers/managers';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 16,
  },
};

const styles = {
  w100: { width: '100%' },
  mb30: { marginBottom: '30px' },
  'text-center': { textAlign: 'center' },
};

const confirm = Modal.confirm;
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
const Option = Select.Option;

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  addManager,
  updateManager,
  deleteManager,
};

@Form.create()
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
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

  getFunction = type => {
    const func = find(propEq('function', type))(
      this.state.manager.managerFunctions,
    );
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
        roleType: values.roleType,
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
          {
            editable: values.editMissing,
            function: 'ASSIST_FINDING_MANAGEMENT',
            readable: values.editMissing || values.readMissing,
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
        <Button
          key="delete"
          type="danger"
          style={{ float: 'left' }}
          onClick={this.handleDelete}>
          刪除此管理者
        </Button>,
      );
    }

    const cardFunc = this.getFunction('CARD_MANAGEMENT');
    const memberFunc = this.getFunction('MEMBER_MANAGEMENT');
    const deviceFunc = this.getFunction('DEVICE_MANAGEMENT');
    const systemFunc = this.getFunction('SYSTEM_MANAGEMENT');
    const missingFunc = this.getFunction('ASSIST_FINDING_MANAGEMENT');

    return (
      <Modal
        width="75%"
        title={manager.id ? '編輯管理權限' : '新增管理權限'}
        visible={true}
        onOk={this.handleSave}
        onCancel={onClose}
        maskClosable={false}
        footer={footer}
        okText="確認"
        cancelText="取消">
        <Form hideRequiredMark>
          <Row style={styles.mb30}>
            <Col span={7}>
              <FormItem {...formItemLayout} label="帳號" colon={false}>
                {getFieldDecorator('memberId', {
                  rules: [
                    { required: true, message: '輸入帳號', whitespace: true },
                    {
                      validator: this.validateName,
                    },
                  ],
                  initialValue: manager.memberId,
                })(<Input style={styles.w100} />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...formItemLayout} label="密碼" colon={false}>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: manager.id ? false : true,
                      message: '輸入密碼',
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (value && (value.length < 5 || value.length > 20)) {
                          return callback('密碼長度必須介於 5 - 20 個字元');
                        }
                        return callback();
                      },
                    },
                  ],
                })(<Input style={styles.w100} />)}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem {...formItemLayout} label="權限" colon={false}>
                {getFieldDecorator('roleType', {
                  rules: [{ required: true, message: '請選擇權限' }],
                  initialValue: manager.id && String(manager.roles[0].id),
                })(
                  <Select>
                    <Option key="1" value="1">
                      主管理者
                    </Option>
                    <Option key="2" value="2">
                      副管理者
                    </Option>
                    <Option key="3" value="3">
                      一般管理者
                    </Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <ColM span={4} />
            <ColM span={4}>卡片管理</ColM>
            <ColM span={4}>用戶管理</ColM>
            <ColM span={4}>裝置管理</ColM>
            <ColM span={4}>系統管理</ColM>
            <ColM span={4}>協尋管理</ColM>
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
            <ColM span={4}>
              <FormItem>
                {getFieldDecorator('editMissing', {
                  valuePropName: 'defaultChecked',
                  initialValue: !!missingFunc.editable,
                })(<Checkbox />)}
              </FormItem>
            </ColM>
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
            <ColM span={4}>
              <FormItem>
                {getFieldDecorator('readMissing', {
                  valuePropName: 'defaultChecked',
                  initialValue: !!missingFunc.readable,
                })(<Checkbox />)}
              </FormItem>
            </ColM>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default EditPermissionModal;
