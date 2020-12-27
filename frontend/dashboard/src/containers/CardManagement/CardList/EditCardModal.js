/* eslint-disable indent */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { pathOr, join, map, filter, compose } from 'ramda';
import moment from 'moment';
import styled from 'styled-components';
import { Modal, Form, Input, Row, Col, Button, Select } from 'antd';

import { validateMobile, validateIdentityId } from './validation';
import {
  UsageStatus,
  Status,
  Sex,
  updateCard,
  deleteCard,
} from 'reducers/cards';
import DatePicker from './DatePicker';
import MapModal from './MapModal';
import { RequiredMark } from './style';

const { TextArea } = Input;
const Option = Select.Option;
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

const styles = {
  w100: { width: '100%' },
  w85: { width: '85%' },
};

const mapStateToProps = state => ({
  cardInfo: state.cards.cardInfo,
  regions: state.cards.regions,
});

const mapDispatchToProps = {
  updateCard,
  deleteCard,
};

@Form.create()
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class EditCardModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      mapModalVisible: false,
      isEditing: false,
    };
  }

  handleEdit = () => {
    this.setState({ isEditing: true });
  };

  handleCancelEdit = () => {
    this.setState({ isEditing: false });
  };

  handleSave = () => {
    const { form, onClose } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const newCard = Object.assign({}, this.props.card, {
        enableTime: values.enableTime.valueOf(),
        expireTime: values.expireTime.valueOf(),
        masterManager: values.memberId,
        status: values.status,
        major: values.major,
        minor: values.minor,
        remark: values.remark,
        cardContact1: values.contact1,
        cardContact2: values.contact2,
        cardOwner: {
          ...values.cardOwner,
          birthdayTime:
            values.cardOwner.birthdayTime &&
            values.cardOwner.birthdayTime.valueOf(),
        },
        regionInfoId: values.regionInfoId,
      });

      this.props.updateCard({ card: newCard, closeModal: onClose });
    });
  };

  handleDelete = () => {
    const { card, onClose, deleteCard } = this.props;

    confirm({
      title: `確定要刪除卡片 ${card.uuid}`,
      onOk() {
        deleteCard(card.id);
        onClose();
      },
    });
  };

  handleMapModalVisible = () => {
    this.setState({
      mapModalVisible: !this.state.mapModalVisible,
    });
  };

  render() {
    const {
      card,
      regions,
      cardInfo: {
        cardContact1: contact1,
        cardContact2: contact2,
        remark,
        cardOwner,
        ...cardInfo
      },
      form: { getFieldDecorator },
      onClose,
    } = this.props;

    const { mapModalVisible, isEditing } = this.state;

    const footer = [
      <Button
        key="delete"
        type="danger"
        style={{ float: 'left' }}
        onClick={this.handleDelete}>
        刪除卡片
      </Button>,
      <Button key="cancel" onClick={onClose}>
        取消
      </Button>,
      ...(isEditing
        ? [
            <Button key="cancle-edit" onClick={this.handleCancelEdit}>
              取消編輯
            </Button>,
            <Button key="save" type="primary" onClick={this.handleSave}>
              確認
            </Button>,
          ]
        : [
            <Button key="enable-edit" type="primary" onClick={this.handleEdit}>
              編輯
            </Button>,
          ]),
    ];

    return (
      <Modal
        width="75%"
        title="編輯卡片"
        visible={true}
        onCancel={onClose}
        maskClosable={false}
        keyboard={false}
        footer={footer}>
        <Form hideRequiredMark>
          <RowM>
            <ColLabel span={3}>ID</ColLabel>
            <ColContent span={8}>{card.uuid}</ColContent>
            <ColLabel span={3}>Major</ColLabel>
            <ColContent span={4}>
              <FormItem>{card.major}</FormItem>
            </ColContent>
            <ColLabel span={3}>Minor</ColLabel>
            <ColContent span={3}>
              <FormItem>{card.minor}</FormItem>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>電量</ColLabel>
            <ColContent span={8}>{card.battery}</ColContent>
            <ColLabel span={3}>使用狀態</ColLabel>
            <ColContent span={4}>
              {UsageStatus[String(card.usageStatus)]}
            </ColContent>
            <ColLabel span={3}>綁定狀態</ColLabel>
            <ColContent span={3}>{Status[String(card.status)]}</ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              <RequiredMark />
              使用期限
            </ColLabel>
            <Col span={isEditing ? 5 : 4}>
              <FormItem style={{ marginLeft: 25 }}>
                {!isEditing &&
                  moment(card.enableTime).format('YYYY-MM-DD HH:mm')}
                {isEditing &&
                  getFieldDecorator('enableTime', {
                    rules: [{ required: true, message: '請輸入開始時間' }],
                    initialValue: moment(card.enableTime),
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD  HH:mm"
                      placeholder="開始時間"
                    />,
                  )}
              </FormItem>
            </Col>
            <Col span={1}>
              <span
                style={{
                  display: 'inline-block',
                  width: '100%',
                  textAlign: 'center',
                }}>
                至
              </span>
            </Col>
            <Col span={isEditing ? 5 : 3}>
              <FormItem>
                {!isEditing &&
                  moment(card.expireTime).format('YYYY-MM-DD HH:mm')}
                {isEditing &&
                  getFieldDecorator('expireTime', {
                    rules: [{ required: true, message: '請輸入結束時間' }],
                    initialValue: moment(card.expireTime),
                  })(
                    <DatePicker
                      style={{ width: '100%' }}
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD  HH:mm"
                      placeholder="結束時間"
                    />,
                  )}
              </FormItem>
            </Col>
            <ColLabel span={3} offset={isEditing ? 4 : 0}>
              區域
            </ColLabel>
            <ColContent span={4}>
              <FormItem>
                {!isEditing && card.regionInfoName}
                {isEditing &&
                  getFieldDecorator('regionInfoId', {
                    initialValue: card.regionInfoId,
                  })(
                    <Select style={{ width: 110 }}>
                      {regions.map(i => {
                        return (
                          <Option key={i.id} value={i.id}>
                            {i.name}
                          </Option>
                        );
                      })}
                    </Select>,
                  )}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>受管理者姓名</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && cardOwner && cardOwner.name}
                {isEditing &&
                  getFieldDecorator('cardOwner.name', {
                    initialValue: cardOwner && cardOwner.name,
                  })(<Input style={styles.w85} placeholder="姓名" />)}
              </FormItem>
            </ColContent>
            <ColLabel span={2}>性別</ColLabel>
            <ColContent span={3}>
              <FormItem style={styles.w85}>
                {!isEditing && cardOwner && Sex[cardOwner.sex]}
                {isEditing &&
                  getFieldDecorator('cardOwner.sex', {
                    initialValue: cardOwner ? String(cardOwner.sex) : undefined,
                  })(
                    <Select placeholder="請選擇性別" allowClear>
                      <Option value="0">女性</Option>
                      <Option value="1">男性</Option>
                    </Select>,
                  )}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>出生日期</ColLabel>
            <ColContent span={4}>
              <FormItem>
                {!isEditing && cardOwner && cardOwner.birthday}
                {isEditing &&
                  getFieldDecorator('cardOwner.birthdayTime', {
                    initialValue:
                      cardOwner && moment(cardOwner.birthdayTime).isValid()
                        ? moment(cardOwner.birthdayTime)
                        : null,
                  })(
                    <DatePicker
                      taiwanCalendar
                      style={styles.w85}
                      format="tYY-MM-DD"
                    />,
                  )}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>身分證字號</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && cardOwner && cardOwner.identityId}
                {isEditing &&
                  getFieldDecorator('cardOwner.identityId', {
                    rules: [{ validator: validateIdentityId }],
                    initialValue: cardOwner && cardOwner.identityId,
                  })(<Input style={styles.w85} placeholder="身分證字號" />)}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>聯絡電話</ColLabel>
            <ColContent span={21}>
              <FormItem>
                {!isEditing && cardOwner && cardOwner.contactMobile}
                {isEditing &&
                  getFieldDecorator('cardOwner.contactMobile', {
                    rules: [{ validator: validateMobile }],
                    initialValue: cardOwner && cardOwner.contactMobile,
                  })(<Input style={{ width: 300 }} placeholder="聯絡電話" />)}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>主管理帳號</ColLabel>
            <ColContent span={21}>
              <FormItem>
                {!isEditing && card.memberId}
                {isEditing &&
                  getFieldDecorator('memberId', {
                    initialValue: card.memberId,
                  })(<Input style={{ width: 300 }} placeholder="主管理帳號" />)}
              </FormItem>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>副管理帳號</ColLabel>
            <ColContent span={21}>
              <FormItem>
                {compose(
                  join(', '),
                  map(pathOr('', ['memberInfo', 'memberId'])),
                  filter(x => x.type === 2),
                  pathOr([], ['cardAuthorities']),
                )(cardInfo)}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>聯絡人 1 (選填)</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && contact1 && contact1.name}
                {isEditing &&
                  getFieldDecorator('contact1.name', {
                    initialValue: contact1 && contact1.name,
                  })(<Input style={styles.w85} placeholder="姓名" />)}
              </FormItem>
            </ColContent>
            <ColLabel span={2}>性別</ColLabel>
            <ColContent span={3}>
              <FormItem style={styles.w85}>
                {!isEditing && contact1 && Sex[contact1.sex]}
                {isEditing &&
                  getFieldDecorator('contact1.sex', {
                    initialValue: contact1 ? String(contact1.sex) : undefined,
                  })(
                    <Select placeholder="請選擇性別" allowClear>
                      <Option value="0">女性</Option>
                      <Option value="1">男性</Option>
                    </Select>,
                  )}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>關係</ColLabel>
            <ColContent span={4}>
              <FormItem>
                {!isEditing && contact1 && contact1.relationship}
                {isEditing &&
                  getFieldDecorator('contact1.relationship', {
                    initialValue: contact1 && contact1.relationship,
                  })(<Input style={styles.w85} placeholder="關係" />)}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>聯絡電話</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && contact1 && contact1.contactMobile}
                {isEditing &&
                  getFieldDecorator('contact1.contactMobile', {
                    rules: [{ validator: validateMobile }],
                    initialValue: contact1 && contact1.contactMobile,
                  })(<Input style={styles.w85} placeholder="聯絡電話" />)}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>聯絡人 2 (選填)</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && contact2 && contact2.name}
                {isEditing &&
                  getFieldDecorator('contact2.name', {
                    initialValue: contact2 && contact2.name,
                  })(<Input style={styles.w85} placeholder="姓名" />)}
              </FormItem>
            </ColContent>
            <ColLabel span={2}>性別</ColLabel>
            <ColContent span={3}>
              <FormItem style={styles.w85}>
                {!isEditing && contact2 && Sex[contact2.sex]}
                {isEditing &&
                  getFieldDecorator('contact2.sex', {
                    initialValue: contact2 ? String(contact2.sex) : undefined,
                  })(
                    <Select placeholder="請選擇性別" allowClear>
                      <Option value="-1"></Option>
                      <Option value="0">女性</Option>
                      <Option value="1">男性</Option>
                    </Select>,
                  )}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>關係</ColLabel>
            <ColContent span={4}>
              <FormItem>
                {!isEditing && contact2 && contact2.relationship}
                {isEditing &&
                  getFieldDecorator('contact2.relationship', {
                    initialValue: contact2 && contact2.relationship,
                  })(<Input style={styles.w85} placeholder="關係" />)}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>聯絡電話</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && contact2 && contact2.contactMobile}
                {isEditing &&
                  getFieldDecorator('contact2.contactMobile', {
                    rules: [{ validator: validateMobile }],
                    initialValue: contact2 && contact2.contactMobile,
                  })(<Input style={styles.w85} placeholder="聯絡電話" />)}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>位置</ColLabel>
            <ColContent span={21}>
              <Button onClick={this.handleMapModalVisible}>動態搜尋</Button>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>歷史紀錄</ColLabel>
            <ColContent span={21}>
              <Button onClick={this.handleMapModalVisible}>查看紀錄</Button>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>備註</ColLabel>
            <ColContent span={21}>
              <FormItem>
                {!isEditing && remark}
                {isEditing &&
                  getFieldDecorator('remark', {
                    initialValue: remark,
                  })(<TextArea autoSize />)}
              </FormItem>
            </ColContent>
          </RowM>
        </Form>

        {mapModalVisible && (
          <MapModal card={card} onClose={this.handleMapModalVisible} />
        )}
      </Modal>
    );
  }
}

export default EditCardModal;
