import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  Form,
  Row,
  Select,
  Input
} from 'antd';

import {
  addGuardArea
} from 'reducers/guardAreas';

const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 12
  }
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  addGuardArea
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class ConfirmGuardAreaModal extends Component {

  handleSave = () => {
    const {
      onClose,
      form: { validateFields },
      newCenter,
      ufos,
      addGuardArea
    } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      addGuardArea({
        guardareaEnable: values.status === 'enable',
        name: values.name,
        positionLatitude: newCenter.lat,
        positionLongitude: newCenter.lng,
        ufoSeqs: ufos
      });
      onClose();
    });
  };

  render() {
    const {
      ufos,
      onClose,
      form: { getFieldDecorator }
    } = this.props;

    return (
      <Modal
        title="裝置管理 > 守護區域管理 > 新增守護區域"
        width="40%"
        visible={true}
        onOk={this.handleSave}
        onCancel={onClose}
        maskClosable={false}
        keyboard={false}
      >
        <Row style={{ marginTop: 10 }}>
          <FormItem
            label="守護區域名稱"
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '區域名稱為必填欄位' }]
            })(
              <Input placeholder="請輸入守護區域名稱" />
            )}
          </FormItem>
        </Row>

        <Row>
          <FormItem
            label="啟用狀態"
            {...formItemLayout}
          >
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '請選擇狀態' }],
              initialValue: 'enable'
            })(
              <Select>
                <Option key="enable" value="enable">
                  啟用中
                </Option>
                <Option key="disable" value="disable">
                  停用中
                </Option>
              </Select>
            )}
          </FormItem>
        </Row>

        <Row>
          <FormItem
            label="UFO數量"
            {...formItemLayout}
          >
            {ufos.length}
          </FormItem>
        </Row>
      </Modal>
    );
  }
}

export default ConfirmGuardAreaModal;
