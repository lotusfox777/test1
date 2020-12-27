import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { findIndex, propEq } from 'ramda';
import styled from 'styled-components';
import { Modal, Form, Input, DatePicker, Row, Col, Checkbox, Divider, Select } from 'antd';

import { listCards } from 'reducers/cards';
import { listCardGroups } from 'reducers/cardGroups';

const FormItem = styled(Form.Item).attrs({
  colon: false,
})`
  margin-bottom: 0px !important;
`;
const { Option, OptGroup } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 12,
  },
};

const mapStateToProps = state => ({
  cards: state.cards,
  cardGroups: state.cardGroups,
});

const mapDispatchToProps = {
  listCards,
  listCardGroups,
};

@Form.create()
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class GuardAreaModal extends Component {
  constructor(props) {
    super(props);
    let defaultList = [];
    if (props.currentGuardArea) {
      if (props.currentGuardArea.cardGroups) {
        defaultList = defaultList.concat(
          props.currentGuardArea.cardGroups.map(group => group.groupName),
        );
      }
      if (props.currentGuardArea.cards) {
        defaultList = defaultList.concat(props.currentGuardArea.cards.map(card => card.cardName));
      }
    }

    this.state = {
      isAlways: props.currentGuardArea ? props.currentGuardArea.isAlways : false,
      currentGuardArea: props.currentGuardArea || {},
      defaultList,
    };
  }

  handleAlwaysGuard = () => {
    this.setState({
      isAlways: !this.state.isAlways,
    });
  };

  handleSave = () => {
    const {
      form: { getFieldValue, setFields, validateFields },
      cards,
      cardGroups,
      onSave,
    } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      const _cards = [];
      const _cardGroups = [];
      values.list.forEach(name => {
        const cardIdx = findIndex(propEq('cardName', name))(cards.content);
        const cardGroupIdx = findIndex(propEq('groupName', name))(cardGroups.content);
        if (cardIdx > -1) {
          _cards.push(cards.content[cardIdx]);
        } else if (cardGroupIdx > -1) {
          _cardGroups.push(cardGroups.content[cardGroupIdx]);
        }
      });

      const newGuardArea = {
        cards: _cards,
        cardGroups: _cardGroups,
        cardSeqs: _cards.map(x => x.id),
        cardGroupSeqs: _cardGroups.map(x => x.id),
        guardareaEnable: true,
        guardareaName: values.guardareaName,
        isAlways: !!values.isAlways,
      };

      if (this.state.currentGuardArea.id) {
        newGuardArea.id = this.state.currentGuardArea.id;
      }

      if (!!values.isAlways) {
        return onSave(newGuardArea);
      }

      const startTime = getFieldValue('startTime');
      const endTime = getFieldValue('endTime');
      if (!startTime) {
        return setFields({
          startTime: {
            errors: [new Error('請輸入開始時間')],
          },
        });
      } else if (!endTime) {
        return setFields({
          endTime: {
            errors: [new Error('請輸入結束時間')],
          },
        });
      }

      onSave(
        Object.assign(newGuardArea, {
          endTime: endTime.valueOf(),
          startTime: startTime.valueOf(),
        }),
      );
    });
  };

  componentDidMount() {
    this.props.listCards({
      type: 1,
      page: 0,
      size: 99999,
    });
    this.props.listCardGroups({
      page: 0,
      size: 99999,
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      cards,
      cardGroups,
      onClose,
    } = this.props;
    const { isAlways, currentGuardArea, defaultList } = this.state;
    const title = currentGuardArea.id ? '編輯守護區域' : '新增守護區域';
    return (
      <Modal
        width="35%"
        title={title}
        visible={true}
        onOk={this.handleSave}
        onCancel={onClose}
        maskClosable={false}
        okText="確認"
        cancelText="取消">
        <Form hideRequiredMark>
          <Row>
            <FormItem label="名稱" {...formItemLayout}>
              {getFieldDecorator('guardareaName', {
                rules: [{ required: true, message: '請輸入名稱' }],
                initialValue: currentGuardArea.name,
              })(<Input placeholder="請輸入名稱" />)}
            </FormItem>
          </Row>

          <Divider />

          <Row>
            <FormItem label="開始時間" {...formItemLayout}>
              {getFieldDecorator('startTime', {
                initialValue: moment(currentGuardArea.startTime),
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                  disabled={isAlways}
                />,
              )}
            </FormItem>
          </Row>

          <Row style={{ marginTop: 24 }}>
            <FormItem label="結束時間" {...formItemLayout}>
              {getFieldDecorator('endTime', {
                initialValue: moment(currentGuardArea.endTime),
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  style={{ width: '100%' }}
                  disabled={isAlways}
                />,
              )}
            </FormItem>
          </Row>

          <Row style={{ marginTop: 24 }}>
            <Col span={2} />
            <Col>
              <FormItem>
                {getFieldDecorator('isAlways', {
                  initialValue: isAlways,
                  valuePropName: 'checked',
                })(
                  <Checkbox style={{ fontWeight: 'bold' }} onChange={this.handleAlwaysGuard}>
                    設為常態守護區域
                  </Checkbox>,
                )}
              </FormItem>
            </Col>
          </Row>

          <Divider />

          <Row>
            <FormItem label="守護名單">
              {getFieldDecorator('list', {
                rules: [{ required: true, message: '請輸入守護名單' }],
                initialValue: defaultList,
              })(
                <Select mode="multiple" style={{ width: '100%' }} placeholder="請選擇守護名單">
                  <OptGroup label="群組">
                    {cardGroups.content.map(group => {
                      return (
                        <Option key={`cardGroup-${group.id}`} value={group.groupName}>
                          {group.groupName}
                        </Option>
                      );
                    })}
                  </OptGroup>
                  <OptGroup label="個人">
                    {cards.content.map(card => {
                      return (
                        <Option key={`card-${card.id}`} value={card.cardName}>
                          {card.cardName}
                        </Option>
                      );
                    })}
                  </OptGroup>
                </Select>,
              )}
            </FormItem>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default GuardAreaModal;
