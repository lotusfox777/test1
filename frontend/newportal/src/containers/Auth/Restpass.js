import React, { Component } from 'react';
import { Form, Button, Row, Col,  Modal } from 'antd';
import Input from 'antd/lib/input/Input';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { resetpassword } from 'reducers/forgotpassword';

const FormItem = Form.Item;

const StyledModal = styled(Modal).attrs({
  bordered: false,
  visible: true,
  footer: false
})`
  margin: 0 auto;

  .ant-card-head-title {
    font-size: 20px;
    text-align: center;
  }
`;

const mapStateToProps = state => ({
  forgotpwd: state.forgotpassword,
  token: ''
});

const mapDispatchToProps = {
  resetpassword
};

@connect(
  mapStateToProps,
  mapDispatchToProps
)
@Form.create()
export default class Forgotpassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmDirty: false,
      token: this.props.match.params.subPath
    };
  }


  handleSubmit = e => {
    const {
      form: { validateFields },
      resetpassword
    } = this.props;
    const { token } = this.state;

    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        resetpassword({
          token: token,
          password:values.password
        });
      }
    });
  };
  // 處理比較密碼
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密碼不一致, 請再確認!');
    } else {
      callback();
    }
  };


  render() {
    const {
      form: { getFieldDecorator },
      forgotpwd
    } = this.props;

    return (
      <StyledModal title="請重新設定您的密碼" width="50%">
        <Row>
          <Col span={8}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem label="密碼">
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '密碼長度為5~20字元',
                      pattern: new RegExp(/^.{5,20}$/)
                    },
                    {
                      validator: this.validateToNextPassword
                    }
                  ]
                })(<Input type="password" placeholder="請輸入您的密碼" />)}
              </FormItem>
              <FormItem label="再次輸入密碼">
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: '請再次您的密碼'
                    },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
              </FormItem>
              <Row>
                <Col style={{ marginTop: 50 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={forgotpwd.isLoading}
                    className="login-form-button"
                    disabled={this.props.forgotpwd.errMsg !== ''}>
                    確認
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </StyledModal>
    );
  }
}
