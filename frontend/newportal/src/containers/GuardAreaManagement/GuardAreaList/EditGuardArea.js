import * as React from 'react';
import * as moment from 'moment';
import { Modal, Input, Checkbox, DatePicker, Switch, Row, Col, Form, Select } from 'antd';
import { find, propEq } from 'ramda';
import styled from 'styled-components';
import StyleButton from 'components/Button';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const Option = Select.Option;

const StylePanelWrap = styled.div`
  font-family: MicrosoftJhengHei;
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #4a4a4a;
  padding: 14px 14px 0px 14px;

  .ant-row {
    vertical-align: middle;
  }

  .ant-row a.delete-btn {
    font-size: 14px;
    line-height: normal;
    color: #f5222d;
    line-height: 3;
    vertical-align: middle;
  }
  .ant-row a.delete-btn:hover {
    color: #f5222d;
    text-decoration: underline;
    text-decoration-color: #f5222d;
  }

  .view-date span {
    margin-right: 15px;
    display: block;
    float: left;
  }
  .view-date span:last-child {
    margin-right: 0px;
  }

  .lightblue-font {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.31;
    color: #79abe5;
  }

  label {
    font-weight: 600;
  }
`;

const gutter = {
  marginRight: '9px',
};
const label = {
  lineHeight: 2.5,
  verticalAlign: 'middle',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};
const label_02 = {
  lineHeight: 2.5,
  verticalAlign: 'middle',
  paddingLeft: '3%',
};
const dateinput = {
  width: '100%',
};

@Form.create()
class EditGuardArea extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isAlways: props.guardArea.isAlways,
    };
  }

  handleCancel = () => {
    const { onCancel, guardArea } = this.props;
    onCancel(guardArea.id);
  };

  handleDelete = () => {
    const { onDelete, guardArea } = this.props;
    confirm({
      title: '確認刪除守護區域?',
      onOk() {
        onDelete(guardArea.id);
      },
    });
  };

  handleSave = () => {
    const { form, onOk, allCardGroups, allCards, guardArea } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { cards, ...rest } = values;

      const requestData = {
        ...rest,
        id: guardArea.id,
        name: values.guardareaName,
        ...(values.startTime ? { startTime: values.startTime.valueOf() } : {}),
        ...(values.endTime ? { endTime: values.endTime.valueOf() } : {}),
        cards: [],
        cardGroups: [],
        cardSeqs: [],
        cardGroupSeqs: [],
      };

      cards.forEach((cardId) => {
        const id = +cardId;
        const findCard = find(propEq('id', id))(allCards);
        const findCardGroup = find(propEq('id', id))(allCardGroups);

        if (findCard) {
          requestData.cards.push(findCard);
          requestData.cardSeqs.push(id);
        }
        if (findCardGroup) {
          requestData.cardGroups.push(findCardGroup);
          requestData.cardGroupSeqs.push(id);
        }
      });

      onOk(requestData);
    });
  };

  handleChange = (e) => {
    this.setState(
      {
        isAlways: e.target.checked,
      },
      () => {
        if (this.state.isAlways) {
          const { form } = this.props;
          const values = form.getFieldsValue();
          form.setFields({
            startTime: { value: values.startTime, errors: null },
            endTime: { value: values.endTime, errors: null },
          });
        }
      },
    );
  };

  render() {
    const {
      guardArea,
      allCards,
      allCardGroups,
      form: { getFieldDecorator },
      onEditRange,
    } = this.props;
    const { isAlways } = this.state;
    return (
      <StylePanelWrap>
        <Form>
          <Row>
            <Col lg={4} style={label}>
              <label>守護區域名稱</label>
            </Col>
            <Col lg={18}>
              <FormItem>
                {getFieldDecorator('guardareaName', {
                  rules: [{ required: true, message: '請輸入守護區域名稱' }],
                  initialValue: guardArea.name,
                })(<Input placeholder="請輸入守護區域名稱" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={4} style={label}>
              啟用狀態
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('guardareaEnable', {
                  initialValue: guardArea.guardareaEnable,
                  valuePropName: 'checked',
                })(<Switch />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col lg={4} style={label}>
              範圍有效時間
            </Col>
            <Col lg={8}>
              <FormItem>
                {getFieldDecorator('startTime', {
                  rules: [{ required: !isAlways, message: '請輸入開始時間' }],
                  initialValue: moment(guardArea.startTime).isValid()
                    ? moment(guardArea.startTime)
                    : null,
                })(
                  <DatePicker
                    style={dateinput}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    disabled={isAlways}
                  />,
                )}
              </FormItem>
            </Col>
            <Col lg={2} style={label_02}>
              至
            </Col>
            <Col lg={8}>
              <FormItem>
                {getFieldDecorator('endTime', {
                  rules: [{ required: !isAlways, message: '請輸入結束時間' }],
                  initialValue: moment(guardArea.endTime).isValid()
                    ? moment(guardArea.endTime)
                    : null,
                })(
                  <DatePicker
                    style={dateinput}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    disabled={isAlways}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem>
                {getFieldDecorator('isAlways', {
                  valuePropName: 'checked',
                  initialValue: isAlways,
                })(<Checkbox onChange={this.handleChange}>設為常態守護區域</Checkbox>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col lg={4} style={label}>
              守護名單
            </Col>
            <Col lg={18}>
              <FormItem>
                {getFieldDecorator('cards', {
                  rules: [
                    {
                      validator: (rule, value, callback) => {
                        if (value && value.length === 0) {
                          return callback('請至少選擇一個群組或裝置');
                        }
                        return callback();
                      },
                    },
                  ],
                  initialValue: guardArea.cards
                    .map((x) => String(x.id))
                    .concat(guardArea.cardGroups.map((x) => String(x.id))),
                })(
                  <Select
                    mode="multiple"
                    allowClear
                    getPopupContainer={(trigger) => trigger.parentNode}>
                    <Select.OptGroup label="群組">
                      {allCardGroups.map((x) => (
                        <Option key={x.id} value={String(x.id)}>
                          {x.groupName}
                        </Option>
                      ))}
                    </Select.OptGroup>
                    <Select.OptGroup label="個人">
                      {allCards.map((x) => (
                        <Option key={x.id} value={String(x.id)}>
                          {x.cardName}
                        </Option>
                      ))}
                    </Select.OptGroup>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Row className="footer">
          {!guardArea.isSystemArea ? (
            <Col span={4}>
              <a onClick={this.handleDelete} className="delete-btn">
                刪除守護區域
              </a>
            </Col>
          ) : null}
          <Col span={guardArea.isSystemArea ? 22 : 18} style={{ textAlign: 'right' }}>
            {!guardArea.isSystemArea && (
              <StyleButton text="編輯範圍" type="white" style={gutter} onClick={onEditRange} />
            )}
            <StyleButton text="取消" style={gutter} onClick={this.handleCancel} />
            <StyleButton text="確認" onClick={this.handleSave} />
          </Col>
        </Row>
      </StylePanelWrap>
    );
  }
}

export default EditGuardArea;
