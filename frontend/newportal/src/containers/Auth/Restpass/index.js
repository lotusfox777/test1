import React, { Component } from 'react';
import { Form, Row } from 'antd';
import Input from 'antd/lib/input/Input';
import StyleButton from 'components/Button';
import { StyledModal } from '../components';
import { connect } from 'react-redux';
import { resetpassword } from 'reducers/forgotpassword';

const FormItem = Form.Item;

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
          password: values.password
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
    const title = '歡迎回來, ' + forgotpwd.username;
    return (
      <StyledModal>
        <div className="title_01 mb_36">
          {title}
          <div className="title_02">請重新設定您的登入密碼</div>
        </div>
        <Form onSubmit={this.handleSubmit} hideRequiredMark>
          <FormItem label="密碼" colon={false} className="mb_50">
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
          <FormItem label="再次輸入密碼" colon={false} className="mb_90">
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
            })(
              <Input
                type="password"
                placeholder="請再次輸入您的密碼"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </FormItem>
          <Row className="mb_124">
            <StyleButton
              className="btn_type_h40"
              type="darkblue"
              text="發送認證信"
              htmlType="submit"
              loading={forgotpwd.isLoading}
              disabled={this.props.forgotpwd.errMsg !== ''}
            />
          </Row>
        </Form>
      </StyledModal>
    );
  }
}
