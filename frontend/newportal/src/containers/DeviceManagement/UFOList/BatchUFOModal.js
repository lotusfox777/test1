import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { range } from 'ramda';
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Button,
  Select
} from 'antd';

import {
  Status,
  addUFOs
} from 'reducers/ufos';

const FormItem = styled(Form.Item)`
  margin-bottom: 0px !important;
`;
const TextArea = Input.TextArea;
const Option = Select.Option;


const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  addUFOs
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class BatchUFOModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      totalUFOs: 1
    };
  }

  handleAddUFO = () => {
    const totalUFOs = this.state.totalUFOs + 1;
    this.setState({
      totalUFOs
    });
  }

  handleDeleteUFO = () => {
    const totalUFOs = this.state.totalUFOs - 1;
    this.setState({
      totalUFOs
    });
  }

  handleSave = () => {
    const {
      totalUFOs
    } = this.state;
    const {
      addUFOs,
      onClose,
      form: { validateFields }
    } = this.props;
    validateFields((err, values) => {
      if (err) {
        return;
      }

      const ufos = [];
      for (let i = 0; i < totalUFOs; i++) {
        ufos.push({
          ufoId: values[`ufoId-${i}`],
          latitude: values[`latitude-${i}`],
          longitude: values[`longitude-${i}`],
          status: values[`status-${i}`],
          remark: values[`remark-${i}`]
        });
      }
      addUFOs(ufos);
      onClose();
    });
  };

  renderUFOS() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const {
      totalUFOs
    } = this.state;

    return range(0, totalUFOs).map((_, idx) => {
      return (
        <Row
          key={idx}
          type="flex"
          align="middle"
          gutter={8}
          style={{ marginTop: 15 }}
        >
          <Col span={5}>
            <FormItem>
              {getFieldDecorator(`ufoId-${idx}`, {
                rules: [{ required: true, message: '請輸入UFO ID' }]
              })(
                <Input placeholder="UFO ID" />
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem>
              {getFieldDecorator(`status-${idx}`, {
                rules: [{ required: true, message: '請選擇狀態' }]
              })(
                <Select placeholder="請選擇">
                  <Option value="-1">{Status['-1']}</Option>
                  <Option value="1">{Status['1']}</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem>
              {getFieldDecorator(`latitude-${idx}`, {
                rules: [{ required: true, message: '請輸入經度' }]
              })(
                <Input placeholder="經度" />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem>
              {getFieldDecorator(`longitude-${idx}`, {
                rules: [{ required: true, message: '請輸入緯度' }]
              })(
                <Input placeholder="緯度" />
              )}
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem>
              {getFieldDecorator(`remark-${idx}`)(
                <TextArea rows={1} />
              )}
            </FormItem>
          </Col>
          {
            totalUFOs > 1 && idx === totalUFOs - 1 &&
            <Col span={1}>
              <Button
                style={{ marginLeft: 10 }}
                icon="minus"
                onClick={this.handleDeleteUFO}
              />
            </Col>
          }
        </Row>
      );
    });
  }

  render() {
    const {
      onClose
    } = this.props;

    return (
      <Modal
        width="70%"
        title="批次新增UFO"
        visible={true}
        onOk={this.handleSave}
        onCancel={onClose}
        maskClosable={false}
        okText="確認"
        cancelText="取消">
        <Form hideRequiredMark>
          <Row gutter={8}>
            <Col span={5}>
              UFO ID
            </Col>
            <Col span={5}>
              狀態
            </Col>
            <Col span={4}>
              經度
            </Col>
            <Col span={4}>
              緯度
            </Col>
            <Col span={5}>
              備註
            </Col>
          </Row>
          {this.renderUFOS()}
          <Row style={{ marginTop: 15 }}>
            <Button
              icon="plus"
              onClick={this.handleAddUFO}
            />
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default BatchUFOModal;
