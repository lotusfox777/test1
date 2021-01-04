/* eslint-disable indent */
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { pathOr, join, map, filter, compose, propEq, allPass } from 'ramda';
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
import { withI18next } from 'locales/withI18next';

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

const mapStateToProps = (state) => ({
  cardInfo: state.cards.cardInfo,
  regions: state.cards.regions,
});

const mapDispatchToProps = {
  updateCard,
  deleteCard,
};

@Form.create()
@connect(mapStateToProps, mapDispatchToProps)
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
    const { t, card, onClose, deleteCard } = this.props;

    confirm({
      title: t('all:確定要刪除卡片', { id: card.uuid }),
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
      t,
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
        {t('all:Delete')}
      </Button>,
      <Button key="cancel" onClick={onClose}>
        {t('all:Cancel')}
      </Button>,
      ...(isEditing
        ? [
            <Button key="cancle-edit" onClick={this.handleCancelEdit}>
              {t('all:Cancel')}
            </Button>,
            <Button key="save" type="primary" onClick={this.handleSave}>
              {t('all:Ok')}
            </Button>,
          ]
        : [
            <Button key="enable-edit" type="primary" onClick={this.handleEdit}>
              {t('all:Edit')}
            </Button>,
          ]),
    ];

    return (
      <Modal
        width="75%"
        title={t('all:Edit Title')}
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
            <ColLabel span={3}>{t('all:Battery')}</ColLabel>
            <ColContent span={8}>{card.battery}</ColContent>
            <ColLabel span={3}>{t('all:Bracelet status')}</ColLabel>
            <ColContent span={4}>
              {UsageStatus[String(card.usageStatus)]}
            </ColContent>
            <ColLabel span={3}>{t('all:Account connection')}</ColLabel>
            <ColContent span={3}>{Status[String(card.status)]}</ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>
              <RequiredMark />
              {t('all:Expiration date')}
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
                {t('all:To')}
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
              {t('all:Address')}
            </ColLabel>
            <ColContent span={4}>
              <FormItem>
                {!isEditing && card.regionInfoName}
                {isEditing &&
                  getFieldDecorator('regionInfoId', {
                    initialValue: card.regionInfoId,
                  })(
                    <Select style={{ width: 110 }}>
                      {regions.map((i) => {
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
            <ColLabel span={3}>{t('all:Name')}</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && cardOwner && cardOwner.name}
                {isEditing &&
                  getFieldDecorator('cardOwner.name', {
                    initialValue: cardOwner && cardOwner.name,
                  })(<Input style={styles.w85} placeholder={t('all:Name')} />)}
              </FormItem>
            </ColContent>
            <ColLabel span={2}>{t('all:Sex')}</ColLabel>
            <ColContent span={3}>
              <FormItem style={styles.w85}>
                {!isEditing && cardOwner && Sex[cardOwner.sex]}
                {isEditing &&
                  getFieldDecorator('cardOwner.sex', {
                    initialValue: cardOwner ? String(cardOwner.sex) : undefined,
                  })(
                    <Select placeholder={t('all:select')} allowClear>
                      <Option value="0">{t('all:Female')}</Option>
                      <Option value="1">{t('all:Male')}</Option>
                    </Select>,
                  )}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>{t('all:Birthday')}</ColLabel>
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
            <ColLabel span={3}>{t('all:ID')}</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && cardOwner && cardOwner.identityId}
                {isEditing &&
                  getFieldDecorator('cardOwner.identityId', {
                    rules: [{ validator: validateIdentityId }],
                    initialValue: cardOwner && cardOwner.identityId,
                  })(<Input style={styles.w85} placeholder={t('all:ID')} />)}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>{t('all:Phone number')}</ColLabel>
            <ColContent span={21}>
              <FormItem>
                {!isEditing && cardOwner && cardOwner.contactMobile}
                {isEditing &&
                  getFieldDecorator('cardOwner.contactMobile', {
                    rules: [{ validator: validateMobile }],
                    initialValue: cardOwner && cardOwner.contactMobile,
                  })(
                    <Input
                      style={{ width: 300 }}
                      placeholder={t('all:Phone number')}
                    />,
                  )}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>{t('all:Main monitor account')}</ColLabel>
            <ColContent span={21}>
              <FormItem>
                {!isEditing ? (
                  <React.Fragment>
                    {card.memberId}
                    <span style={{ marginLeft: 30 }}>
                      Address：
                      {card.county ||
                      card.district ||
                      card.village ||
                      card.address ? (
                        <React.Fragment>
                          {card.district}
                          {card.village}
                          {card.address}
                        </React.Fragment>
                      ) : (
                        'None'
                      )}
                    </span>
                  </React.Fragment>
                ) : (
                  getFieldDecorator('memberId', {
                    initialValue: card.memberId,
                  })(
                    <Input
                      style={{ width: 300 }}
                      placeholder={t('all:Main monitor account')}
                    />,
                  )
                )}
              </FormItem>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>{t('all:Assisted monitor account')}</ColLabel>
            <ColContent span={21}>
              <FormItem>
                {compose(
                  join(', '),
                  map(pathOr('', ['memberInfo', 'memberId'])),
                  filter((x) => x.type === 2),
                  pathOr([], ['cardAuthorities']),
                )(cardInfo)}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>{t('all:Contact1(option)')}</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && contact1 && contact1.name}
                {isEditing &&
                  getFieldDecorator('contact1.name', {
                    initialValue: contact1 && contact1.name,
                  })(<Input style={styles.w85} placeholder={t('all:Name')} />)}
              </FormItem>
            </ColContent>
            <ColLabel span={2}>{t('all:Sex')}</ColLabel>
            <ColContent span={3}>
              <FormItem style={styles.w85}>
                {!isEditing && contact1 && Sex[contact1.sex]}
                {isEditing &&
                  getFieldDecorator('contact1.sex', {
                    initialValue: contact1 ? String(contact1.sex) : undefined,
                  })(
                    <Select placeholder={t('all:select')} allowClear>
                      <Option value="0">{t('all:Female')}</Option>
                      <Option value="1">{t('all:Male')}</Option>
                    </Select>,
                  )}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>{t('all:Relationship')}</ColLabel>
            <ColContent span={4}>
              <FormItem>
                {!isEditing && contact1 && contact1.relationship}
                {isEditing &&
                  getFieldDecorator('contact1.relationship', {
                    initialValue: contact1 && contact1.relationship,
                  })(
                    <Input
                      style={styles.w85}
                      placeholder={t('all:Relationship')}
                    />,
                  )}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>{t('all:Phone number')}</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && contact1 && contact1.contactMobile}
                {isEditing &&
                  getFieldDecorator('contact1.contactMobile', {
                    rules: [{ validator: validateMobile }],
                    initialValue: contact1 && contact1.contactMobile,
                  })(
                    <Input
                      style={styles.w85}
                      placeholder={t('all:Phone number')}
                    />,
                  )}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>{t('all:Contact2(option)')}</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && contact2 && contact2.name}
                {isEditing &&
                  getFieldDecorator('contact2.name', {
                    initialValue: contact2 && contact2.name,
                  })(<Input style={styles.w85} placeholder={t('all:Name')} />)}
              </FormItem>
            </ColContent>
            <ColLabel span={2}>{t('all:Sex')}</ColLabel>
            <ColContent span={3}>
              <FormItem style={styles.w85}>
                {!isEditing && contact2 && Sex[contact2.sex]}
                {isEditing &&
                  getFieldDecorator('contact2.sex', {
                    initialValue: contact2 ? String(contact2.sex) : undefined,
                  })(
                    <Select placeholder={t('all:select')} allowClear>
                      <Option value="-1"></Option>
                      <Option value="0">{t('all:Female')}</Option>
                      <Option value="1">{t('all:Male')}</Option>
                    </Select>,
                  )}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>{t('all:Relationship')}</ColLabel>
            <ColContent span={4}>
              <FormItem>
                {!isEditing && contact2 && contact2.relationship}
                {isEditing &&
                  getFieldDecorator('contact2.relationship', {
                    initialValue: contact2 && contact2.relationship,
                  })(
                    <Input
                      style={styles.w85}
                      placeholder={t('all:Relationship')}
                    />,
                  )}
              </FormItem>
            </ColContent>
            <ColLabel span={3}>{t('all:Phone number')}</ColLabel>
            <ColContent span={3}>
              <FormItem>
                {!isEditing && contact2 && contact2.contactMobile}
                {isEditing &&
                  getFieldDecorator('contact2.contactMobile', {
                    rules: [{ validator: validateMobile }],
                    initialValue: contact2 && contact2.contactMobile,
                  })(
                    <Input
                      style={styles.w85}
                      placeholder={t('all:Phone number')}
                    />,
                  )}
              </FormItem>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>{t('all:Trace')}</ColLabel>
            <ColContent span={21}>
              <Button onClick={this.handleMapModalVisible}>
                {t('all:Search trace')}
              </Button>
            </ColContent>
          </RowM>

          <RowM>
            <ColLabel span={3}>{t('all:Trace')}</ColLabel>
            <ColContent span={21}>
              <Button onClick={this.handleMapModalVisible}>
                {t('all:Search trace')}
              </Button>
            </ColContent>
          </RowM>
          <RowM>
            <ColLabel span={3}>{t('all:Memo')}</ColLabel>
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

export default withI18next(['all'])(EditCardModal);
