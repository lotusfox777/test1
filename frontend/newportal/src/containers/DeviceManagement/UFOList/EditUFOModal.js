import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import styled from 'styled-components';
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Button,
  Select,
  Tag
} from 'antd';

import {
  Status,
  updateUFO,
  deleteUFO
} from 'reducers/ufos';

import MapUFOModal from './MapUFOModal';

const confirm = Modal.confirm;

const FormItem = styled(Form.Item)`
  margin-bottom: 0px !important;
`;
const RowM = styled(Row)`
  margin-top: 3px;
  display: flex !important;
  align-items: center !important;

  &:nth-child(even) {
    background-color: #fafafa;
  }
`;
const ColLabel = styled(Col)`
  background-color: #1f3954;
  color: white;
  text-align: left;
  padding: 12px !important;
`;
const ColContent = styled(Col)`
  padding-left: 25px !important;
`;
const Option = Select.Option;
const TextArea = Input.TextArea;

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  updateUFO,
  deleteUFO
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class EditUFOModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mapModalVisible: false
    };
  }

  handleSave = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const newUFO = Object.assign({}, this.props.ufo, values);
      this.props.updateUFO(newUFO);
      this.props.onClose();
    });
  };

  handleDelete = () => {
    const {
      ufo,
      onClose,
      deleteUFO
    } = this.props;

    confirm({
      title: `確定要刪除UFO ${ufo.ufoId}`,
      onOk() {
        deleteUFO(ufo.id);
        onClose();
      }
    });
  };

  handleMapModalVisible = () => {
    this.setState({
      mapModalVisible: !this.state.mapModalVisible
    });
  };

  render() {
    const {
      ufo,
      form: { getFieldDecorator },
      onClose
    } = this.props;
    const {
      mapModalVisible
    } = this.state;

    const footer = [
      <Button
        key="delete"
        type="danger"
        style={{ float: 'left' }}
        onClick={this.handleDelete}
      >
        刪除UFO
      </Button>,
      <Button
        key="cancel"
        onClick={onClose}
      >
        取消
      </Button>,
      <Button
        key="save"
        type="primary"
        onClick={this.handleSave}
      >
        確認
      </Button>
    ];

    return (
      <Modal
        width="75%"
        title="編輯UFO"
        visible={true}
        onOk={this.handleSave}
        onCancel={onClose}
        maskClosable={false}
        footer={footer}
      >
        <Form hideRequiredMark>
          <RowM>
            <ColLabel span={3}>
              UFO ID
            </ColLabel>
            <ColContent span={6}>
              {ufo.ufoId}
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              狀態
            </ColLabel>
            <ColContent span={6}>
              <FormItem>
                {getFieldDecorator('status', {
                  rules: [{ required: true, message: '請選擇狀態' }],
                  initialValue: String(ufo.status)
                })(
                  <Select placeholder="請選擇">
                    <Option key="-1" value="-1">
                      {Status['-1']}
                    </Option>
                    <Option key="1" value="1">
                      {Status['1']}
                    </Option>
                  </Select>
                )}
              </FormItem>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              設置時間
            </ColLabel>
            <ColContent span={6}>
              {moment(ufo.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              最後連線時間
            </ColLabel>
            <ColContent span={6}>
              {moment(ufo.updateTime).format('YYYY-MM-DD HH:mm:ss')}
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              位置
            </ColLabel>
            <ColContent span={6}>
              <Button onClick={this.handleMapModalVisible}>
                查看位置
              </Button>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              座標
            </ColLabel>
            <ColContent span={21}>
              <Row>
                <Col span={4}>
                  <span>經度</span>
                  <Tag style={{ marginLeft: 6 }}>{ufo.latitude}</Tag>
                </Col>
                <Col span={4}>
                  <span>緯度</span>
                  <Tag style={{ marginLeft: 6 }}>{ufo.longitude}</Tag>
                </Col>
              </Row>
            </ColContent>
          </RowM>

          <Row style={{ marginTop: 3 }}>
            <ColLabel span={3}>
              備註
            </ColLabel>
            <ColContent span={6}>
              <FormItem>
                {getFieldDecorator('remark', {
                  initialValue: ufo.remark
                })(
                  <TextArea rows={4} />
                )}
              </FormItem>
            </ColContent>
          </Row>
        </Form>

        {
          mapModalVisible &&
          <MapUFOModal
            ufo={ufo}
            onClose={this.handleMapModalVisible}
          />
        }
      </Modal>
    );
  }
}

export default EditUFOModal;
