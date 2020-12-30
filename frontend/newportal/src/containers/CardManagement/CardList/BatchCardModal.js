import * as React from 'react';
import { Col, Row, Icon, Form, Input, Modal, message } from 'antd';
import StyleButton from 'components/Button';
import TooltipButton from 'components/TooltipButton';
import Papa from 'papaparse';
import styled from 'styled-components';
import { padStart } from 'utils/webHelper';
import { withI18next } from 'locales/withI18next'

const FormItem = Form.Item;

const StyledModal = styled(Modal)`
  .ant-modal-title {
    font-family: MicrosoftJhengHei;
    font-size: 16px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.31;
    letter-spacing: normal;
  }

  .ant-modal-body {
    padding-top: 8px;
  }

  .ant-form .ant-form-item-label {
    line-height: 39.9px;
  }

  .footer {
    text-align: right;
    margin-top: 28px;
  }
`;

@Form.create()
class BatchCardModal extends React.PureComponent {
  componentDidMount() {
    this.initialFormItem();
  }
  // Modal events
  initialFormItem = () => {
    //reset 欄位
    const { form } = this.props;
    form.setFieldsValue({
      keys: [],
      cards: [],
    });
    // We need at least one field
    this.add();
  };

  handleOk = (e) => {
    const { form, onOk } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const cards = values.cards.map((x) => ({ ...x, colorCode: '#f5b243' })).filter(Boolean);

      this.handleCancel();
      onOk(cards);
    });
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  // 新增欄位
  add = () => {
    const { form } = this.props;

    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(keys.length);

    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  // 刪除欄位
  remove = (k) => () => {
    const { form } = this.props;
    const { keys, cards } = form.getFieldsValue();

    if (keys.length === 1) {
      return;
    }
    const newKeys = keys.filter((key) => key !== k).map((_, idx) => idx);
    const newCards = cards.filter((_, idx) => idx !== k);
    form.setFieldsValue({ keys: newKeys, cards: [...newCards] });
  };

  importExcel = () => {
    const { form } = this.props;

    this.fileupload.click();
    this.fileupload.onchange = () => {
      // todo: windows mime type issue
      // text/csv is not worked
      // if (this.fileupload.files[0].type !== 'text/csv') {
      //   message.error(
      //     '上傳格式錯誤，系統只支援 csv 檔案類型，請確認您的檔案格式'
      //   );
      //   return;
      // }

      Papa.parse(this.fileupload.files[0], {
        complete: (results) => {
          const hasErrors = results.errors.length > 0;
          if (hasErrors) {
            message.error(
              <div>
                {results.errors.map((x) => (
                  <div>{x.message}</div>
                ))}
              </div>,
            );
            return;
          }

          const values = form.getFieldsValue();
          const keys = [...values.keys];
          const cards = [...values.cards];

          let uuid = keys.length;

          results.data.forEach((x) => {
            const [id, major, minor, cardName] = x;
            cards.push({
              uuid: id,
              major,
              minor,
              cardName,
            });

            form.getFieldDecorator(`cards[${uuid}].uuid`, { initialValue: id });
            form.getFieldDecorator(`cards[${uuid}].major`, {
              initialValue: major,
            });
            form.getFieldDecorator(`cards[${uuid}].minor`, {
              initialValue: minor,
            });
            form.getFieldDecorator(`cards[${uuid}].cardName`, {
              initialValue: cardName,
            });

            keys.push(uuid);
            uuid += 1;
          });

          form.setFieldsValue({ cards, keys });

          this.fileupload.value = null;
        },
      });
    };
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      t,
    } = this.props;

    getFieldDecorator('keys', { initialValue: [] });

    const keys = getFieldValue('keys');

    const formItemLayout = {
      wrapperCol: { span: 24 },
    };

    const uuid = keys.length;

    const formItems = keys.map((k, index) => {
      return (
        <Row key={k}>
          <Col span={1}>
            <FormItem>{padStart(String(index + 1), 3, '0')}</FormItem>
          </Col>
          <Col span={9}>
            <FormItem {...formItemLayout} required={true}>
              {getFieldDecorator(`cards[${k}].uuid`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '請輸入ID',
                  },
                ],
              })(<Input placeholder="請輸入ID" style={{ width: '95%' }} />)}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              {getFieldDecorator(`cards[${k}].major`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{ required: true, message: '此欄位必填' }],
              })(<Input style={{ width: '90%' }} />)}
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem>
              {getFieldDecorator(`cards[${k}].minor`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{ required: true, message: '此欄位必填' }],
              })(<Input style={{ width: '90%' }} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} required={true}>
              {getFieldDecorator(`cards[${k}].cardName`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '請輸入ID名稱',
                  },
                ],
              })(<Input placeholder="請輸入ID名稱" style={{ width: '80%', marginRight: 8 }} />)}
              {k < uuid - 1 ? (
                <Icon
                  className="text-20"
                  style={{ color: '#d9d9d9' }}
                  type="minus-circle-o"
                  disabled={keys.length === 1}
                  onClick={this.remove(k)}
                />
              ) : null}
              {k === uuid - 1 ? (
                <span>
                  <Icon
                    className="text-20"
                    style={{ color: '#d9d9d9' }}
                    type="minus-circle-o"
                    disabled={keys.length === 1}
                    onClick={this.remove(k)}
                  />
                  <TooltipButton
                    iconStyle={{ color: '#79abe5' }}
                    className="ml-3"
                    name="新增欄位"
                    type="plus-circle-o"
                    onClick={this.add}
                  />
                </span>
              ) : null}
            </FormItem>
          </Col>
        </Row>
      );
    });

    return (
      <StyledModal
        title={
          <div>
            <span style={{ fontSize: '16px' }}>{t('batch bracelet')}</span>
            <span
              style={{
                color: '#999',
                fontSize: '12px',
                fontWeight: 'normal',
              }}>
              {/* 「頭像照片」及「標示顏色」請至個人裝置中編輯 */}
            </span>
          </div>
        }
        visible={true}
        width="70%"
        onCancel={this.handleCancel}
        footer={null}>
        <div style={{ marginBottom: 31 }}>
          <input
            type="file"
            accept=".csv"
            id="uploadfile"
            ref={(c) => (this.fileupload = c)}
            hidden
          />
          <StyleButton style={{ fontSize: 14 }} text="以CSV匯入" onClick={this.importExcel} />
        </div>
        <Row style={{ marginBottom: 10 }}>
          <Col span={1}>#</Col>
          <Col span={9}>ID</Col>
          <Col span={3}>Major</Col>
          <Col span={3}>Minor</Col>
          <Col span={8}>自訂名稱</Col>
        </Row>
        <Form>{formItems}</Form>
        <Row className="footer">
          <StyleButton
            style={{ marginRight: '9px', fontSize: 14 }}
            type="white"
            text="取消"
            onClick={this.handleCancel}
          />
          <StyleButton style={{ fontSize: 14 }} text="新增" onClick={this.handleOk} />
        </Row>
      </StyledModal>
    );
  }
}
export default withI18next(['all'])(BatchCardModal);
