import * as React from 'react';
import {
  Tooltip,
  Col,
  Row,
  Icon,
  Form,
  Input,
  Modal,
  message,
  Select,
} from 'antd';
import Papa from 'papaparse';
import { compose } from 'ramda';
import { connect } from 'react-redux';
import moment from 'moment';
import Button from 'components/Button';
import { padStart } from 'utils/webHelper';
import { addCards } from 'reducers/cards';

import DatePicker from './DatePicker';
import { RequiredMark } from './style';

const FormItem = Form.Item;
const Option = Select.Option;

class ImportModal extends React.PureComponent {
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

  handleOk = e => {
    const { form, addCards, onCancel } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const cards = values.cards
        .map(x => ({
          ...x,
          colorCode: '#f5b243',
          enableTime: x.enableTime.format('x'),
          expireTime: x.expireTime.format('x'),
        }))
        .filter(Boolean);

      addCards({ cards, closeModal: onCancel });
    });
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
  remove = k => () => {
    const { form } = this.props;
    const { keys, cards } = form.getFieldsValue();

    if (keys.length === 1) {
      return;
    }
    const newKeys = keys.filter(key => key !== k).map((_, idx) => idx);
    const newCards = cards.filter((_, idx) => idx !== k);
    form.setFieldsValue({ keys: newKeys, cards: [...newCards] });
  };

  _isRowEmpty = val => {
    let empty = true;

    for (let key in val) {
      if (val[key]) {
        empty = false;
        return;
      }
    }
    return empty;
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
        complete: results => {
          const hasErrors = results.errors.length > 0;
          if (hasErrors) {
            message.error(
              <div>
                {results.errors.map(x => (
                  <div>{x.message}</div>
                ))}
              </div>
            );
            return;
          }

          const values = form.getFieldsValue();

          const isRowEmpty = this._isRowEmpty(values.cards[0]);

          const keys = isRowEmpty ? [] : [...values.keys];
          const cards = isRowEmpty ? [] : [...values.cards];

          let uuid = keys.length;

          results.data.forEach(x => {
            const [id, major, minor, enableTime, expireTime, regionInfoId] = x;
            const enableTime_momentType = moment(enableTime);
            const expireTime_momentType = moment(expireTime);

            cards.push({
              uuid: id,
              major,
              minor,
              enableTime: enableTime_momentType,
              expireTime: expireTime_momentType,
              regionInfoId,
            });

            form.getFieldDecorator(`cards[${uuid}].uuid`, { initialValue: id });
            form.getFieldDecorator(`cards[${uuid}].major`, {
              initialValue: major,
            });
            form.getFieldDecorator(`cards[${uuid}].minor`, {
              initialValue: minor,
            });
            form.getFieldDecorator(`cards[${uuid}].enableTime`, {
              initialValue: enableTime_momentType,
            });
            form.getFieldDecorator(`cards[${uuid}].expireTime`, {
              initialValue: expireTime_momentType,
            });
            form.getFieldDecorator(`cards[${uuid}].regionInfoId`, {
              initialValue: regionInfoId,
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
      onCancel,
      loading,
      regions,
      form: { getFieldDecorator, getFieldValue },
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
          <Col span={4}>
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
          <Col span={4}>
            <FormItem>
              {getFieldDecorator(`cards[${k}].enableTime`, {
                rules: [{ required: true, message: '請輸入開始時間' }],
              })(
                <DatePicker
                  style={{ width: '90%', minWidth: 170 }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD  HH:mm"
                  placeholder="使用期限起"
                />
              )}
            </FormItem>
          </Col>
          <Col span={1}>
            <span
              style={{
                display: 'inline-block',
                width: '90%',
                textAlign: 'center',
              }}>
              至
            </span>
          </Col>
          <Col span={4}>
            <FormItem>
              {getFieldDecorator(`cards[${k}].expireTime`, {
                rules: [{ required: true, message: '請輸入結束時間' }],
              })(
                <DatePicker
                  style={{ width: '90%', minWidth: 170 }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD  HH:mm"
                  placeholder="使用期限迄"
                />
              )}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem {...formItemLayout} required={true}>
              {getFieldDecorator(`cards[${k}].regionInfoId`)(
                <Select
                  placeholder="區域"
                  style={{ width: 100, marginRight: '3px' }}>
                  {regions.map(i => {
                    return (
                      <Option key={i.id} value={i.id}>
                        {i.name}
                      </Option>
                    );
                  })}
                </Select>
              )}
              {k < uuid - 1 ? (
                <Icon
                  style={{ color: '#d9d9d9' }}
                  type="minus-circle-o"
                  disabled={keys.length === 1}
                  onClick={this.remove(k)}
                />
              ) : null}
              {k === uuid - 1 ? (
                <span>
                  <Icon
                    style={{ color: '#d9d9d9' }}
                    type="minus-circle-o"
                    disabled={keys.length === 1}
                    onClick={this.remove(k)}
                  />
                  <Tooltip title="新增欄位">
                    <Icon
                      style={{ color: '#79abe5', marginLeft: '3px' }}
                      type="plus-circle-o"
                      onClick={this.add}
                    />
                  </Tooltip>
                </span>
              ) : null}
            </FormItem>
          </Col>
        </Row>
      );
    });

    return (
      <Modal
        width="75%"
        style={{ minWidth: 1082 }}
        title="新增卡片"
        visible={true}
        onOk={this.handleOk}
        confirmLoading={loading}
        onCancel={onCancel}
        maskClosable={false}
        keyboard={false}
        okText="確認"
        cancelText="取消">
        <div style={{ marginBottom: 31 }}>
          <input
            type="file"
            accept=".csv"
            id="uploadfile"
            ref={c => (this.fileupload = c)}
            hidden
          />
          <Button icon="download" onClick={this.importExcel}>
            以CSV匯入
          </Button>
        </div>
        <Row style={{ marginBottom: 10 }}>
          <Col span={1}>#</Col>
          <Col span={4}>
            <RequiredMark />
            ID
          </Col>
          <Col span={3}>
            <RequiredMark />
            Major
          </Col>
          <Col span={3}>
            <RequiredMark />
            Minor
          </Col>
          <Col span={4}>
            <RequiredMark />
            使用期限
          </Col>
          <Col span={1}></Col>
          <Col span={4}></Col>
          <Col span={4}>區域</Col>
        </Row>
        <Form>{formItems}</Form>
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
    mapDispatchToProps
  )
)(ImportModal);
