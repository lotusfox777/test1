/* eslint no-unused-vars:1, consistent-return:0, indent:0, no-multi-spaces:0, no-nested-ternary:0, no-use-before-define:0, semi:0, no-trailing-spaces:0, prefer-const:0, no-empty:0, react/sort-comp:0, react/self-closing-comp:0, eol-last:0, padded-blocks:0 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'ramda';
import styled from 'styled-components';
import moment from 'moment';
import { Modal, Select, Form, Col, Row, Input } from 'antd';
import { addCards } from 'reducers/cards';
import DatePicker from './DatePicker';
import { validateMobile, validateIdentityId } from './validation';
import { RequiredMark } from './style';

const Option = Select.Option;

const FormItem = styled(Form.Item)`
  .ant-form-item-label {
    text-align: left;
  }
`;

const H3 = styled.h3`
  margin-bottom: 1.5em;

  &.flex {
    display: flex;
    justify-content: space-between;
  }
`;

const HR = styled.hr`
  margin-left: -20px;
  margin-right: -20px;
  margin-bottom: 30px;
  border-top: none;
  border-bottom: 1px solid #ddd;
`;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 12,
  },
};

const styles = {
  w100: { width: '100%' },
};

class NewCardModal extends Component {
  handleSave = () => {
    const { addCards, onClose, form } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      addCards({
        cards: [
          {
            ...values,
            cardOwner: {
              ...values.cardOwner,
              birthdayTime:
                values.cardOwner.birthdayTime &&
                values.cardOwner.birthdayTime.valueOf(),
            },
            enableTime: moment(values.enableTime).valueOf(),
            expireTime: moment(values.expireTime).valueOf(),
          },
        ],
        closeModal: onClose,
      });
    });
  };

  render() {
    const {
      regions,
      form: { getFieldDecorator },
      onClose,
      loading,
    } = this.props;

    return (
      <Modal
        width={800}
        bodyStyle={{ paddingLeft: 48, paddingRight: 48 }}
        title="新增卡片"
        visible={true}
        onOk={this.handleSave}
        confirmLoading={loading}
        onCancel={onClose}
        maskClosable={false}
        keyboard={false}
        okText="確認"
        cancelText="取消">
        <Form>
          <H3>卡片資料</H3>
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={10}>
              <FormItem
                {...{
                  ...formItemLayout,
                  labelCol: { span: 3 },
                  wrapperCol: { span: 21 },
                }}
                label="ID"
                colon={false}>
                {getFieldDecorator('uuid', {
                  rules: [{ required: true, message: '此欄位必填' }],
                })(<Input placeholder="請輸入卡號" style={styles.w100} />)}
              </FormItem>
            </Col>
            <Col xs={24} sm={6}>
              <FormItem
                {...{
                  ...formItemLayout,
                  labelCol: { span: 8 },
                  wrapperCol: { span: 16 },
                }}
                label="Major"
                colon={false}>
                {getFieldDecorator('major', {
                  rules: [{ required: true, message: '此欄位必填' }],
                })(<Input />)}
              </FormItem>
            </Col>
            <Col xs={24} sm={6}>
              <FormItem
                {...{
                  ...formItemLayout,
                  labelCol: { span: 8 },
                  wrapperCol: { span: 16 },
                }}
                label="Minor"
                colon={false}>
                {getFieldDecorator('minor', {
                  rules: [{ required: true, message: '此欄位必填' }],
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={9}>
              <FormItem
                {...{
                  ...formItemLayout,
                  labelCol: { span: 7 },
                  wrapperCol: { span: 16 },
                }}
                label="使用期限"
                colon={false}
                style={{ marginBottom: '10px' }}>
                {getFieldDecorator('enableTime', {
                  rules: [{ required: true, message: '請輸入開始時間' }],
                })(
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD  HH:mm"
                    placeholder="開始時間"
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={1} offset={1}>
              <span style={{ marginRight: 5 }}>至</span>
              <RequiredMark />
            </Col>
            <Col xs={24} sm={7}>
              <Form.Item
                {...{
                  ...formItemLayout,
                  labelCol: { span: 7 },
                  wrapperCol: { span: 16 },
                }}
                colon={false}>
                {getFieldDecorator('expireTime', {
                  rules: [{ required: true, message: '請輸入結束時間' }],
                })(
                  <DatePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD  HH:mm"
                    placeholder="結束時間"
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={6}>
              <FormItem
                label="區域"
                colon={false}
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('regionInfoId')(
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
            </Col>
          </Row>
          <HR />
          <H3>受管理者資料</H3>
          <Row>
            <Col span={8}>
              <FormItem
                {...{
                  ...formItemLayout,
                  labelCol: { span: 4 },
                  wrapperCol: { span: 18 },
                }}
                label="姓名"
                colon={false}>
                {getFieldDecorator('cardOwner.name')(
                  <Input placeholder="請輸入姓名" style={styles.w100} />,
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                {...{
                  ...formItemLayout,
                  labelCol: { span: 6 },
                  wrapperCol: { span: 16 },
                }}
                label="性別"
                colon={false}>
                {getFieldDecorator('cardOwner.sex')(
                  <Select placeholder="請選擇性別" allowClear>
                    <Option value="0">女性</Option>
                    <Option value="1">男性</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...{
                  ...formItemLayout,
                  labelCol: { span: 5 },
                  wrapperCol: { span: 18 },
                }}
                label="生日"
                colon={false}>
                {getFieldDecorator('cardOwner.birthdayTime')(
                  <DatePicker
                    taiwanCalendar
                    style={styles.w100}
                    format="tYY-MM-DD"
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem
                {...{
                  ...formItemLayout,
                  labelCol: { span: 7 },
                  wrapperCol: { span: 14 },
                }}
                label="身分證字號"
                colon={false}
                style={{ marginBottom: '10px' }}>
                {getFieldDecorator('cardOwner.identityId', {
                  rules: [{ validator: validateIdentityId }],
                })(<Input placeholder="請輸入身分證字號" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={3}>
              <FormItem
                {...{
                  ...formItemLayout,
                  labelCol: { span: 6 },
                  wrapperCol: { span: 16 },
                }}
                label="聯絡電話"
                colon={false}>
                {getFieldDecorator('cardOwner.contactMobile', {
                  rules: [{ validator: validateMobile }],
                })(<Input placeholder="請輸入聯絡電話" />)}
              </FormItem>
            </Col>
          </Row>
          <HR />
          <H3>
            <Col span={8} style={{ marginBottom: '1.5em' }}>
              <span>聯絡人1(選填)</span>
            </Col>
            <Col span={8} offset={5} style={{ marginBottom: '1.5em' }}>
              <span>聯絡人2(選填)</span>
            </Col>
          </H3>
          <Row>
            <Col span={13}>
              <FormItem
                {...formItemLayout}
                wrapperCol={{ span: 14 }}
                label="姓名"
                colon={false}>
                {getFieldDecorator('cardContact1.name')(
                  <Input placeholder="請輸入姓名" />,
                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem
                {...formItemLayout}
                wrapperCol={{ span: 14 }}
                label="姓名"
                colon={false}>
                {getFieldDecorator('cardContact2.name')(
                  <Input placeholder="請輸入姓名" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={13}>
              <FormItem {...formItemLayout} label="性別" colon={false}>
                {getFieldDecorator('cardContact1.sex')(
                  <Select placeholder="請選擇性別" allowClear>
                    <Option value="0">女性</Option>
                    <Option value="1">男性</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem {...formItemLayout} label="性別" colon={false}>
                {getFieldDecorator('cardContact2.sex')(
                  <Select placeholder="請選擇性別" allowClear>
                    <Option value="0">女性</Option>
                    <Option value="1">男性</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={13}>
              <FormItem {...formItemLayout} label="關係" colon={false}>
                {getFieldDecorator('cardContact1.relationship')(
                  <Input placeholder="請輸入關係" />,
                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem {...formItemLayout} label="關係" colon={false}>
                {getFieldDecorator('cardContact2.relationship')(
                  <Input placeholder="請輸入關係" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={13}>
              <FormItem
                {...formItemLayout}
                wrapperCol={{ span: 14 }}
                label="聯絡電話"
                colon={false}>
                {getFieldDecorator('cardContact1.contactMobile')(
                  <Input placeholder="請輸入聯絡電話" />,
                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem
                {...formItemLayout}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                label="聯絡電話"
                colon={false}>
                {getFieldDecorator('cardContact2.contactMobile')(
                  <Input placeholder="請輸入聯絡電話" />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({ loading: state.cards.isLoading });

const mapDispatchToProps = {
  addCards,
};

export default compose(
  Form.create(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(NewCardModal);
