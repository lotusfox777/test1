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

const mapStateToProps = state => ({
  users: state.users,
});

const mapDispatchToProps = {
  getUser,
  updateUser,
};

@Form.create()
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class EditUserModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: undefined,
      updatingUser: false,
    };
  }

  handleDelete = (idx, type) => {
    const currentUser = { ...this.state.currentUser };

    if (type === 'master') {
      currentUser.masterCards.splice(idx, 1);
    } else {
      currentUser.slaveCards.splice(idx, 1);
    }

    this.setState({ currentUser });
  };

  handleAdd = type => {
    const {
      form: { getFieldsValue, setFields, setFieldsValue },
    } = this.props;
    const { currentUser } = this.state;

    const values = getFieldsValue([
      `${type}-cardId`,
      `${type}-major`,
      `${type}-minor`,
      `${type}-enableTime`,
      `${type}-expireTime`,
    ]);
    if (!values[`${type}-cardId`]) {
      setFields({
        [`${type}-cardId`]: {
          errors: [new Error('請輸入ID')],
        },
      });
      return;
    }

    if (type === 'master') {
      currentUser.masterCards.push({
        cardId: values[`${type}-cardId`],
        major: values[`${type}-major`],
        minor: values[`${type}-minor`],
        enableTime: values[`${type}-enableTime`] || moment.now(),
        expireTime: values[`${type}-expireTime`] || moment.now(),
      });
    } else {
      currentUser.slaveCards.push({
        cardId: values[`${type}-cardId`],
        major: values[`${type}-major`],
        minor: values[`${type}-minor`],
        enableTime: values[`${type}-enableTime`] || moment.now(),
        expireTime: values[`${type}-expireTime`] || moment.now(),
      });
    }

    setFieldsValue({
      [`${type}-cardId`]: '',
      [`${type}-enableTime`]: undefined,
      [`${type}-expireTime`]: undefined,
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
          uuid: card.uuid,
          major: card.major,
          minor: card.minor,
          enableTime: values[`master-enableTime-${idx}`].valueOf(),
          expireTime: values[`master-expireTime-${idx}`].valueOf(),
        };
      });
      if (values['master-cardId']) {
        currentUser.masterCards.push({
          uuid: values['master-cardId'],
          major: values['master-major'],
          minor: values['master-minor'],
          enableTime: values['master-enableTime'].valueOf(),
          expireTime: values['master-expireTime'].valueOf(),
        });
      }
      currentUser.slaveCards = currentUser.slaveCards.map((card, idx) => {
        return {
          uuid: card.uuid,
          major: card.major,
          minor: card.minor,
          enableTime: values[`slave-enableTime-${idx}`].valueOf(),
          expireTime: values[`slave-expireTime-${idx}`].valueOf(),
        };
      });
      if (values['slave-cardId']) {
        currentUser.slaveCards.push({
          uuid: values['slave-cardId'],
          major: values['slave-major'],
          minor: values['slave-minor'],
          enableTime: values['slave-enableTime'].valueOf(),
          expireTime: values['slave-expireTime'].valueOf(),
        });
      }
      this.props.updateUser(currentUser);
      this.setState({
        updatingUser: true,
      });
    });
  };

  componentDidUpdate() {
    const {
      mobileVerified,
      users: { currentUser, isLoading },
    } = this.props;
    const { updatingUser } = this.state;

    if (!this.state.currentUser && !isLoading) {
      this.setState({ currentUser: { ...currentUser, mobileVerified } });
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
          主管理卡片
        </ColLabel>
        <ColContent span={21}>
          {currentUser.masterCards.map((card, idx) => {
            return (
              <Row
                key={idx}
                style={{ height: ROW_HEIGHT }}
                type="flex"
                align="middle">
                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <div style={{ width: 163 }}>{card.uuid || card.cardId}</div>
                  <div style={{ width: 65.44 }}>{card.major}</div>
                  <div style={{ width: 65.44 }}>{card.minor}</div>
                  <FormItem>
                    {getFieldDecorator(`master-enableTime-${idx}`, {
                      rules: [{ required: true, message: '請輸入開始時間' }],
                      initialValue: moment(card.enableTime),
                    })(
                      <DatePicker
                        style={{ width: 195 }}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD  HH:mm"
                        placeholder="開始時間"
                      />,
                    )}
                  </FormItem>
                  至
                  <FormItem>
                    {getFieldDecorator(`master-expireTime-${idx}`, {
                      rules: [{ required: true, message: '請輸入結束時間' }],
                      initialValue: moment(card.expireTime),
                    })(
                      <DatePicker
                        style={{ width: 195 }}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD  HH:mm"
                        placeholder="結束時間"
                      />,
                    )}
                  </FormItem>
                  <Button
                    type="danger"
                    shape="circle"
                    icon="close"
                    onClick={() => this.handleDelete(idx, 'master')}
                  />
                </Col>
              </Row>
            );
          })}

          {this.renderNewCard('master')}
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
        <Col
          span={24}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <FormItem>
            {getFieldDecorator(`${type}-cardId`)(
              <Input style={{ width: 163 }} placeholder="ID" />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator(`${type}-major`)(
              <Input style={{ width: 65.44 }} placeholder="Major" />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator(`${type}-minor`)(
              <Input style={{ width: 65.44 }} placeholder="Minor" />,
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator(`${type}-enableTime`)(
              <DatePicker
                style={{ width: 195 }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD  HH:mm"
                placeholder="開始時間"
              />,
            )}
          </FormItem>
          至
          <FormItem>
            {getFieldDecorator(`${type}-expireTime`)(
              <DatePicker
                style={{ width: 195 }}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD  HH:mm"
                placeholder="結束時間"
              />,
            )}
          </FormItem>
          <Button
            type="primary"
            shape="circle"
            icon="plus"
            onClick={() => this.handleAdd(type)}
          />
        </Col>
      </Row>
    );
  }

  renderSlaveCards() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { currentUser } = this.state;

    const totalHeight = (currentUser.slaveCards.length + 1) * ROW_HEIGHT;

    return (
      <RowM style={{ marginTop: 45, borderTop: '1px solid gray' }}>
        <ColLabel span={3} style={{ height: totalHeight }}>
          副管理卡片
        </ColLabel>
        <ColContent span={21}>
          {currentUser.slaveCards.map((card, idx) => {
            return (
              <Row
                key={idx}
                style={{ height: ROW_HEIGHT }}
                type="flex"
                align="middle">
                <Col
                  span={24}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <div style={{ width: 163 }}>{card.uuid || card.cardId}</div>
                  <div style={{ width: 65.44 }}>{card.major}</div>
                  <div style={{ width: 65.44 }}>{card.minor}</div>
                  <FormItem>
                    {getFieldDecorator(`slave-enableTime-${idx}`, {
                      rules: [{ required: true, message: '請輸入開始時間' }],
                      initialValue: moment(card.enableTime),
                    })(
                      <DatePicker
                        style={{ width: 195 }}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD  HH:mm"
                        placeholder="開始時間"
                      />,
                    )}
                  </FormItem>
                  至
                  <FormItem>
                    {getFieldDecorator(`slave-expireTime-${idx}`, {
                      rules: [{ required: true, message: '請輸入結束時間' }],
                      initialValue: moment(card.expireTime),
                    })(
                      <DatePicker
                        style={{ width: 195 }}
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD  HH:mm"
                        placeholder="結束時間"
                      />,
                    )}
                  </FormItem>
                  <Button
                    type="danger"
                    shape="circle"
                    icon="close"
                    onClick={() => this.handleDelete(idx, 'slave')}
                  />
                </Col>
              </Row>
            );
          })}

          {this.renderNewCard('slave')}
        </ColContent>
      </RowM>
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
              <Tag style={{ marginLeft: currentUser.mobileVerified ? 12 : 0 }}>
                {currentUser.mobileVerified ? '已驗證' : '未驗證'}
              </Tag>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>Line</ColLabel>
            <ColContent span={21}>
              {Status[currentUser.ilineBindingStatus]}
            </ColContent>
          </RowM>

          {this.renderMainCards()}

          {this.renderSlaveCards()}
        </Form>
      </Modal>
    );
  }
}

export default EditUserModal;
