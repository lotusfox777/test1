import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { range, compose, pathOr, path } from 'ramda';
import { Modal, Form, Input, Row, Col, Button, Select, Icon } from 'antd';
import { addCards } from 'reducers/cards';
import DatePicker from './DatePicker';
import { validateMobile, validateIdentityId } from './validation';
import { RequiredMark } from './style';
import { withI18next } from 'locales/withI18next';

const Option = Select.Option;
const confirm = Modal.confirm;

const FormItem = styled(Form.Item)`
  margin-bottom: 0px !important;
`;

const Block = styled.div`
  background: #eee;
  padding: 15px;
  margin-bottom: 24px;
`;

const H4 = styled.h4`
  position: relative;
  top: 3px;
  font-weight: 400;
`;

const DeleteIcon = styled(Icon)`
  position: absolute;
  right: 40px;
  margin-top: -10px;
  margin-left: 10px;
  font-size: 18px;
  cursor: pointer;
`;

const getCardValue = ({ idx, fieldName, fields = [], values }) => {
  return {
    [fieldName]: {
      name: pathOr(undefined, ['cards', idx, fieldName, 'name'], values),
      sex: pathOr(undefined, ['cards', idx, fieldName, 'sex'], values),
      relationship: pathOr(
        undefined,
        ['cards', idx, fieldName, 'relationship'],
        values,
      ),
      contactMobile: pathOr(
        undefined,
        ['cards', idx, fieldName, 'contactMobile'],
        values,
      ),
      ...Object.assign(
        {},
        ...fields.map((field) => ({
          [field]: pathOr(undefined, ['cards', idx, fieldName, field], values),
        })),
      ),
    },
  };
};

class BatchCardModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalCards: 1,
    };
  }

  handleAddCard = () => {
    const totalCards = this.state.totalCards + 1;
    this.setState({
      totalCards,
    });
  };

  handleDeleteCard = () => {
    confirm({
      title: '確定要刪除卡片資訊?',
      content: <div style={{ marginTop: 50 }} />,
      okType: 'danger',
      okText: '刪除',
      width: 350,
      cancelButtonProps: { type: 'primary' },
      onOk: () => {
        const totalCards = this.state.totalCards - 1;
        this.setState({
          totalCards,
        });
      },
    });
  };

  handleSave = () => {
    const { totalCards } = this.state;
    const {
      addCards,
      onClose,
      form: { validateFields },
    } = this.props;

    validateFields((err, values) => {
      if (err) {
        return;
      }

      const cards = [];
      for (let i = 0; i < totalCards; i++) {
        const bt = path(['cards', i, 'cardOwner', 'birthdayTime'], values);

        cards.push({
          uuid: path(['cards', i, 'uuid'], values),
          major: path(['cards', i, 'major'], values),
          minor: path(['cards', i, 'minor'], values),
          enableTime: path(['cards', i, 'enableTime'], values).valueOf(),
          expireTime: path(['cards', i, 'expireTime'], values).valueOf(),
          cardOwner: {
            ...getCardValue({
              fieldName: 'cardOwner',
              idx: i,
              fields: ['identityId'],
              values,
            }).cardOwner,
            birthdayTime: bt && bt.valueOf(),
          },
          ...getCardValue({ fieldName: 'cardContact1', idx: i, values }),
          ...getCardValue({ fieldName: 'cardContact2', idx: i, values }),
        });
      }

      addCards({ cards, closeModal: onClose });
    });
  };

  renderCards() {
    const {
      t,
      regions,
      form: { getFieldDecorator },
    } = this.props;
    const { totalCards } = this.state;

    return range(0, totalCards).map((_, idx) => {
      return (
        <Block key={idx}>
          <Row type="flex" align="middle">
            <Col span={6}>
              <FormItem>
                <RequiredMark />
                {getFieldDecorator(`cards[${idx}].uuid`, {
                  rules: [{ required: true, message: '請輸入ID' }],
                })(<Input placeholder="請輸入ID" style={{ width: '90%' }} />)}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <RequiredMark />
                {getFieldDecorator(`cards[${idx}].major`, {
                  rules: [{ required: true, message: t('all:Required') }],
                })(<Input placeholder="Major" style={{ width: '90%' }} />)}
              </FormItem>
            </Col>
            <Col span={3} style={{ marginLeft: 5 }}>
              <FormItem>
                <RequiredMark />
                {getFieldDecorator(`cards[${idx}].minor`, {
                  rules: [{ required: true, message: t('all:Required') }],
                })(<Input placeholder="Minor" style={{ width: '90%' }} />)}
              </FormItem>
            </Col>
            <Col span={5} style={{ textAlign: 'right' }}>
              <FormItem>
                <RequiredMark />
                {getFieldDecorator(`cards[${idx}].enableTime`, {
                  rules: [{ required: true, message: '請輸入開始時間' }],
                })(
                  <DatePicker
                    style={{ width: '90%', minWidth: 150 }}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD  HH:mm"
                    placeholder="使用期限起"
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
            <Col span={5}>
              <FormItem>
                <RequiredMark />
                {getFieldDecorator(`cards[${idx}].expireTime`, {
                  rules: [{ required: true, message: '請輸入結束時間' }],
                })(
                  <DatePicker
                    style={{ width: '90%', minWidth: 150 }}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD  HH:mm"
                    placeholder="使用期限迄"
                  />,
                )}
              </FormItem>
            </Col>
            {idx === totalCards - 1 && (
              <DeleteIcon type="close" onClick={this.handleDeleteCard} />
            )}
          </Row>
          <Row type="flex" align="middle" gutter={12} style={{ marginTop: 15 }}>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardOwner.name`)(
                  <Input
                    placeholder={t('all:Name')}
                    style={{ width: '90%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardOwner.sex`)(
                  <Select placeholder={t('all:select')} allowClear>
                    <Option value="0">{t('all:Female')}</Option>
                    <Option value="1">{t('all:Male')}</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardOwner.birthdayTime`)(
                  <DatePicker
                    taiwanCalendar
                    format="tYY-MM-DD"
                    placeholder={`${t('all:Birthday')} yyy-mm-dd`}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={2}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].regionInfoId`)(
                  <Select placeholder={t('all:Region')}>
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
            </Col>
            <Col span={5}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardOwner.identityId`, {
                  rules: [{ validator: validateIdentityId }],
                })(
                  <Input placeholder={t('all:ID')} style={{ width: '90%' }} />,
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardOwner.contactMobile`, {
                  rules: [{ validator: validateMobile }],
                })(
                  <Input
                    placeholder={t('all:Phone number')}
                    style={{ width: '90%' }}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row type="flex" align="middle" gutter={12} style={{ marginTop: 15 }}>
            <Col span={2}>
              <H4>{t('all:Contact1')}</H4>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardContact1.name`, {
                  initialValue: '',
                })(
                  <Input
                    placeholder={t('all:Name')}
                    style={{ width: '90%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardContact1.sex`)(
                  <Select placeholder={t('all:select')} allowClear>
                    <Option value="0">{t('all:Female')}</Option>
                    <Option value="1">{t('all:Male')}</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardContact1.relationship`, {
                  initialValue: '',
                })(
                  <Input
                    placeholder={t('all:Relationship')}
                    style={{ width: '90%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardContact1.contactMobile`, {
                  initialValue: '',
                  rules: [{ validator: validateMobile }],
                })(
                  <Input
                    placeholder={t('all:Phone number')}
                    style={{ width: '90%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={2} style={{ marginLeft: -15 }}>
              <H4>{t('all:Optional')}</H4>
            </Col>
          </Row>
          <Row type="flex" align="middle" gutter={12} style={{ marginTop: 15 }}>
            <Col span={2}>
              <H4>{t('all:Contact2')}</H4>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardContact2.name`)(
                  <Input
                    placeholder={t('all:Name')}
                    style={{ width: '90%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardContact2.sex`)(
                  <Select placeholder={t('all:select')} allowClear>
                    <Option value="0">{t('all:Female')}</Option>
                    <Option value="1">{t('all:Male')}</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardContact2.relationship`)(
                  <Input
                    placeholder={t('all:Relationship')}
                    style={{ width: '90%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem>
                {getFieldDecorator(`cards[${idx}].cardContact2.contactMobile`, {
                  rules: [{ validator: validateMobile }],
                })(
                  <Input
                    placeholder={t('all:Phone number')}
                    style={{ width: '90%' }}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={2} style={{ marginLeft: -15 }}>
              <H4>{t('all:Optional')}</H4>
            </Col>
          </Row>
        </Block>
      );
    });
  }

  render() {
    const { t, onClose, loading } = this.props;

    return (
      <Modal
        width="70%"
        style={{ minWidth: 954 }}
        title={t('all:Add')}
        visible={true}
        confirmLoading={loading}
        onOk={this.handleSave}
        onCancel={onClose}
        maskClosable={false}
        keyboard={false}
        okText={t('all:Ok')}
        cancelText={t('all:Cancel')}>
        <Form>
          {this.renderCards()}
          <Row style={{ marginTop: 15 }}>
            <Button icon="plus" onClick={this.handleAddCard} />
          </Row>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({ loading: state.cards.isLoading });

const mapDispatchToProps = {
  addCards,
};

export default compose(
  Form.create(),
  connect(mapStateToProps, mapDispatchToProps),
  withI18next(),
)(BatchCardModal);
