import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
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
  updateGuardArea,
  updateGuardAreaUFOs,
  deleteGuardArea,
  listGuardAreaUFOs
} from 'reducers/guardAreas';

import UFOListModal from './UFOListModal';
import MapGuardAreaModal from './MapGuardAreaModal';

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

const mapStateToProps = state => ({
  guardAreas: state.guardAreas
});

const mapDispatchToProps = {
  updateGuardArea,
  updateGuardAreaUFOs,
  deleteGuardArea,
  listGuardAreaUFOs
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class EditGuardAreaModal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      ufoModalVisible: false,
      mapModalVisible: false,
      gettingUFOs: false,
      guardArea: props.guardArea
    };
  }

  handleUFOModalVisible = () => {
    this.setState({
      updatingUFOs: true,
      ufoModalVisible: !this.state.ufoModalVisible
    });
  };

  handleMapModalVisible = () => {
    this.setState({
      mapModalVisible: !this.state.mapModalVisible
    });
  };

  handleListUFOs = () => {
    this.props.listGuardAreaUFOs({
      body: {
        id: this.state.guardArea.id
      },
      page: 0,
      size: 99999
    });

    this.setState({
      gettingUFOs: true
    });
  }

  handleSave = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const data = Object.assign({
        id: this.props.guardArea.id
      }, values);
      data.guardareaEnable = values.guardareaEnable === '啟用中';
      this.props.updateGuardArea(data);
      this.props.onClose();
    });
  };

  handleDelete = () => {
    const {
      onClose,
      deleteGuardArea
    } = this.props;
    const {
      guardArea
    } = this.state;

    confirm({
      title: `確定要刪除守護區域 ${guardArea.name}`,
      onOk() {
        deleteGuardArea(guardArea.id);
        onClose();
      }
    });
  };

  handleUpdateGuardArea = (ufoSeqs, lat, lng) => {
    const {
      guardArea,
      updateGuardAreaUFOs,
      updateGuardArea
    } = this.props;

    guardArea.positionLatitude = lat;
    guardArea.positionLongitude = lng;
    updateGuardArea(guardArea);
    updateGuardAreaUFOs({
      id: guardArea.id,
      ufoSeqs
    });

    this.setState({
      updatingUFOs: true
    });
  };

  componentDidUpdate(prevProps) {
    const {
      guardAreas: {
        isLoading,
        ufosTotalCount
      }
    } = this.props;
    const {
      gettingUFOs,
      updatingUFOs,
      guardArea
    } = this.state;

    if (gettingUFOs && !isLoading) {
      this.setState({
        gettingUFOs: false,
        mapModalVisible: true
      });
    }

    if (updatingUFOs && !isLoading) {
      guardArea.ufoCount = ufosTotalCount;
      this.setState({
        guardArea,
        updatingUFOs: false
      });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      guardAreas: { ufos },
      onClose
    } = this.props;
    const {
      guardArea,
      ufoModalVisible,
      mapModalVisible
    } = this.state;

    const footer = [
      <Button
        key="delete"
        type="danger"
        style={{ float: 'left' }}
        onClick={this.handleDelete}
      >
        刪除守備區域
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
        title={`裝置管理 > 守護區域管理 > #${guardArea.id}`}
        visible={true}
        onOk={this.handleSave}
        onCancel={onClose}
        maskClosable={false}
        footer={footer}>
        <Form hideRequiredMark>
          <RowM>
            <ColLabel span={3}>
              守護區域ID
            </ColLabel>
            <ColContent span={6}>
              #{guardArea.id}
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              守護區域名稱
            </ColLabel>
            <ColContent span={6}>
              <FormItem>
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '請輸入區域名稱' }],
                  initialValue: guardArea.name
                })(
                  <Input />
                )}
              </FormItem>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              啟用狀態
            </ColLabel>
            <ColContent span={6}>
              <FormItem>
                {getFieldDecorator('guardareaEnable', {
                  rules: [{ required: true, message: '請選擇狀態' }],
                  initialValue: guardArea.guardareaEnable ? '啟用中' : '停用中'
                })(
                  <Select placeholder="請選擇">
                    <Option value="停用中">停用中</Option>
                    <Option value="啟用中">啟用中</Option>
                  </Select>
                )}
              </FormItem>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              UFO數
            </ColLabel>
            <ColContent span={6}>
              <span>{guardArea.ufoCount}</span>
              <Button
                icon="bars"
                style={{ marginLeft: 6 }}
                onClick={() => this.handleUFOModalVisible()}
              />
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              位置
            </ColLabel>
            <ColContent span={6}>
              <Button onClick={this.handleListUFOs}>
                查看範圍
              </Button>
            </ColContent>
          </RowM>
        </Form>

        {
          ufoModalVisible &&
          <UFOListModal
            guardArea={guardArea}
            onClose={this.handleUFOModalVisible}
          />
        }
        {
          mapModalVisible &&
          <MapGuardAreaModal
            guardArea={guardArea}
            ufos={ufos}
            onOk={this.handleUpdateGuardArea}
            onClose={this.handleMapModalVisible}
          />
        }
      </Modal>
    );
  }
}

export default EditGuardAreaModal;
