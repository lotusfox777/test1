import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col
} from 'antd';

import {
  Status,
  addUFOs
} from 'reducers/ufos';

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

const singleFormItemLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 21
  }
};

const doubleFormItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  addUFOs
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class NewUFOModal extends Component {

  handleSave = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.props.addUFOs([values]);
      this.props.onClose();
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      onClose
    } = this.props;

    return (
      <Modal
        width="35%"
        title="新增UFO"
        visible={true}
        onOk={this.handleSave}
        onCancel={onClose}
        maskClosable={false}
        okText="確認"
        cancelText="取消">
        <Form hideRequiredMark>
          <Row>
            <Col span={12}>
              <FormItem
                {...doubleFormItemLayout}
                label="UFO ID"
                colon={false}
              >
                {getFieldDecorator('ufoId', {
                  rules: [{ required: true, message: '請輸入UFO ID' }]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...doubleFormItemLayout}
                label="狀態"
                colon={false}
              >
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '請選擇狀態' }]
                })(
                  <Select placeholder="請選擇">
                    <Option value="-1">{Status['-1']}</Option>
                    <Option value="1">{Status['1']}</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem
                {...doubleFormItemLayout}
                label="經度"
                colon={false}
              >
                {getFieldDecorator('latitude', {
                  rules: [{ required: true, message: '請輸入經度' }]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...doubleFormItemLayout}
                label="緯度"
                colon={false}
              >
                {getFieldDecorator('longitude', {
                  rules: [{ required: true, message: '請輸入緯度' }]
                })(
                  <Input/>
                )}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <FormItem
              {...singleFormItemLayout}
              label="備註"
              colon={false}
            >
              {getFieldDecorator('remark')(
                <TextArea rows={4} />
              )}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default NewUFOModal;
