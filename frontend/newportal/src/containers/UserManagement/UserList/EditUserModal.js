import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import moment from 'moment';
import { Modal, Form, Input, DatePicker, Row, Col, Button, Tag } from 'antd';

import { Status, getUser, updateUser } from 'reducers/users';

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

const ROW_HEIGHT = 65;

const mapStateToProps = (state) => ({
  users: state.users,
});

const mapDispatchToProps = {
  getUser,
  updateUser,
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
class EditUserModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      updatingUser: false,
    };
  }

  handleDelete = (idx) => {
    const { currentUser } = this.state;

    currentUser.masterCards.splice(idx, 1);

    this.setState({ currentUser });
  };

  handleAdd = () => {
    const {
      form: { getFieldsValue, setFields, setFieldsValue },
    } = this.props;
    const { currentUser } = this.state;

    const values = getFieldsValue(['cardId', 'enableTime', 'expireTime']);
    if (!values.cardId) {
      setFields({
        cardId: {
          errors: [new Error('請輸入ID')],
        },
      });
      return;
    }

    currentUser.masterCards.push({
      cardId: values.cardId,
      enableTime: values.enableTime || moment.now(),
      expireTime: values.expireTime || moment.now(),
    });

    setFieldsValue({
      cardId: '',
      enableTime: undefined,
      expireTime: undefined,
    });
    this.setState({
      currentUser,
    });
  };

  handleSave = () => {
    const { currentUser } = this.state;

    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }

      currentUser.masterCards = currentUser.masterCards.map((card, idx) => {
        return {
          cardId: card.cardId,
          enableTime: values[`enableTime-${idx}`].valueOf(),
          expireTime: values[`expireTime-${idx}`].valueOf(),
        };
      });
      this.props.updateUser(currentUser);
      this.setState({
        updatingUser: true,
      });
    });
  };

  componentDidUpdate() {
    const {
      users: { currentUser, isLoading },
    } = this.props;
    const { updatingUser } = this.state;

    if (!this.state.currentUser && !isLoading) {
      this.setState({ currentUser });
    } else if (updatingUser && !isLoading) {
      this.props.onSave();
    }
  }

  componentDidMount() {
    this.props.getUser(this.props.userId);
  }

  renderMainCards() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { currentUser } = this.state;

    const totalHeight = (currentUser.masterCards.length + 1) * ROW_HEIGHT;

    return (
      <RowM style={{ marginTop: 45, borderTop: '1px solid gray' }}>
        <ColLabel span={3} style={{ height: totalHeight }}>
          主管理裝置
        </ColLabel>
        <ColContent span={21}>
          {currentUser.masterCards.map((card, idx) => {
            return (
              <Row key={card.cardId} style={{ height: ROW_HEIGHT }} type="flex" align="middle">
                <Col span={6}>{card.cardId}</Col>
                <Col span={6}>
                  <FormItem>
                    {getFieldDecorator(`enableTime-${idx}`, {
                      rules: [{ required: true, message: '請輸入開始時間' }],
                      initialValue: moment(card.enableTime),
                    })(
                      <DatePicker
                        style={{ width: '90%' }}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD  HH:mm"
                        placeholder="開始時間"
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={1}>至</Col>
                <Col span={6}>
                  <FormItem>
                    {getFieldDecorator(`expireTime-${idx}`, {
                      rules: [{ required: true, message: '請輸入結束時間' }],
                      initialValue: moment(card.expireTime),
                    })(
                      <DatePicker
                        style={{ width: '90%' }}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD  HH:mm"
                        placeholder="結束時間"
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={2}>
                  <Button
                    type="danger"
                    shape="circle"
                    icon="close"
                    onClick={() => this.handleDelete(idx)}
                  />
                </Col>
              </Row>
            );
          })}

          {this.renderNewCard('main')}
        </ColContent>
      </RowM>
    );
  }

  renderNewCard(type) {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Row style={{ height: ROW_HEIGHT }} type="flex" align="middle">
        <Col span={6}>
          <FormItem>
            {getFieldDecorator('cardId')(<Input style={{ width: '90%' }} placeholder="ID" />)}
          </FormItem>
        </Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator('enableTime')(
              <DatePicker
                style={{ width: '90%' }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD  HH:mm"
                placeholder="開始時間"
              />,
            )}
          </FormItem>
        </Col>
        <Col span={1}>至</Col>
        <Col span={6}>
          <FormItem>
            {getFieldDecorator('expireTime')(
              <DatePicker
                style={{ width: '90%' }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD  HH:mm"
                placeholder="結束時間"
              />,
            )}
          </FormItem>
        </Col>
        <Col span={2}>
          <Button type="primary" shape="circle" icon="plus" onClick={this.handleAdd} />
        </Col>
      </Row>
    );
  }

  render() {
    const { onClose } = this.props;
    const { currentUser } = this.state;

    if (!currentUser) {
      return null;
    }

    return (
      <Modal
        width="75%"
        title="編輯用戶資料"
        visible={true}
        onOk={this.handleSave}
        onCancel={onClose}
        maskClosable={false}
        okText="確認"
        cancelText="取消">
        <Form hideRequiredMark>
          <RowM>
            <ColLabel span={3}>E-mail</ColLabel>
            <ColContent span={21}>{currentUser.email}</ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>姓名</ColLabel>
            <ColContent span={21}>{currentUser.name}</ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>手機號碼</ColLabel>
            <ColContent span={21}>
              {currentUser.mobileno}
              <Tag style={{ marginLeft: 12 }}>
                {currentUser.mobileVerified ? '已驗證' : '未驗證'}
              </Tag>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>Line</ColLabel>
            <ColContent span={21}>{Status[currentUser.ilineBindingStatus]}</ColContent>
          </RowM>

          {this.renderMainCards()}

          <RowM>
            <ColLabel span={3}>副管理帳號</ColLabel>
            <ColContent span={21} />
          </RowM>
        </Form>
      </Modal>
    );
  }
}

export default EditUserModal;
