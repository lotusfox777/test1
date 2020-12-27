import React, { Component } from 'react';
import { Form, Row, Col, Button, Popover, Icon, Input } from 'antd';

const InputGroup = Input.Group;
const FormItem = Form.Item;

const error = { color: '#f5222d' };
const gray = { color: 'rgba(0,0,0,.25)' };

@Form.create()
class Birthday extends Component {
  state = { date: '', invalid: false };

  componentDidMount = () => {
    this.setState({ date: this.props.date });
  };

  checkDate = values => {
    const y = Number(values.year) + 1911;
    const m = Number(values.month) - 1;
    const d = values.day;
    const date = new Date(y, m, d);

    const valid = date && date.getMonth() + 1 === Number(values.month);

    this.setState({ invalid: !valid });

    return valid;
  };

  handleOk = () => {
    this.props.form.validateFields((err, values) => {
      const valid = this.checkDate(values);

      if (err || !valid) {
        return;
      }

      const date = `${values.year}/${values.month}/${values.day}`;

      this.props.onClick(date);
      this.setState({ date, invalid: false });
      this.toggleVisible();
    });
  };

  handlePopover = () => {
    this.resetField();
    this.toggleVisible();
  };

  toggleVisible = () => {
    this.setState({ visible: !this.state.visible });
  };

  resetField = () => {
    const initFields = { year: null, month: null, day: null };

    this.props.form.setFieldsValue(initFields);
    this.setState({ invalid: false });
  };

  renderInput = () => {
    const {
      form: { getFieldDecorator }
    } = this.props;

    return (
      <InputGroup>
        <Row gutter={1}>
          <Col span={2} md={2}>
            民國
          </Col>
          <Col span={20} md={3}>
            <FormItem>
              {getFieldDecorator('year', {
                rules: [
                  { required: true, message: '必填' },
                  { pattern: /^[0-9]*$/g, message: '請輸入正確年份' }
                ]
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={2}>年</Col>
          <Col span={22} md={2}>
            <FormItem>
              {getFieldDecorator('month', {
                rules: [
                  { required: true, message: '必填' },
                  { pattern: /0[1-9]|1[012]/, message: '請輸入正確月份' }
                ]
              })(<Input maxLength={2} placeholder="02" />)}
            </FormItem>
          </Col>
          <Col span={2}>月</Col>
          <Col span={22} md={2}>
            <FormItem>
              {getFieldDecorator('day', {
                rules: [
                  { required: true, message: '必填' },
                  {
                    pattern: /0[1-9]|[12][0-9]|3[01]/,
                    message: '請輸入正確日期'
                  }
                ]
              })(<Input maxLength={2} placeholder="08" />)}
            </FormItem>
          </Col>
          <Col span={2}>日</Col>
        </Row>
        <Row>
          {this.state.invalid && <div style={error}>請輸入正確日期</div>}
        </Row>
        <Row style={{ textAlign: 'right' }}>
          <Button onClick={this.handleOk}>OK</Button>
        </Row>
      </InputGroup>
    );
  };

  render() {
    return (
      <Input
        value={this.state.date}
        onClick={this.handlePopover}
        style={{ width: '90%' }}
        suffix={
          <Popover
            placement="bottom"
            content={this.renderInput()}
            visible={this.state.visible}
          >
            {!this.state.visible && <Icon type="calendar" style={gray} />}
            {this.state.visible && (
              <Icon
                type="close-circle"
                onClick={this.toggleVisible}
                style={gray}
              />
            )}
          </Popover>
        }
      />
    );
  }
}

export default Birthday;
