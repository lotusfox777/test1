import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StyleButton from 'components/Button';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { Form, Input, Modal, Row, Checkbox } from 'antd';
import { isNil, equals } from 'ramda';
import { login } from 'reducers/auth';
import { forgotpassword, initpassword } from 'reducers/forgotpassword';
import { StyledModal, Link, RowM, FormItem } from '../components';
import { LOGIN_PAGE, REGISTER, FORGET_PASSWORD } from 'constants/routes';
import { GOOGLE_RECAPTCHA_KEY, OPEN_RECAPTCHA_CHECK, TAIPEI_HOST } from 'constants/endpoint';

const mapStateToProps = state => ({
  auth: state.auth,
  forgotpwd: state.forgotpassword,
  rememberUserId: state.auth.rememberUserId,
  isLoginFailed: state.auth.isLoginFailed,
  isInitCookieAuth: state.views.isInitCookieAuth,
});

const mapDispatchToProps = {
  login,
  forgotpassword,
  initpassword,
};

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
@Form.create()
export default class LoginPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    isLoginFailed: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    const taipeiUrl = window.location.hostname.indexOf(TAIPEI_HOST);

    this.state = {
      currentPage: LOGIN_PAGE,
      isAuthenticated: props.auth.isAuthenticated,
      captchaVal: undefined,
      isAgreement: taipeiUrl > -1,
    };
  }

  componentDidUpdate = (prevProps, prevStates) => {
    if (!equals(prevStates.currentPage, this.state.currentPage)) {
      if (this.state.currentPage === LOGIN_PAGE) {
        if (this.props.forgotpwd.isDone) {
          this.props.initpassword();
        }
      }
    }
  };

  handleSwitchPage = currentPage => {
    this.setState({
      currentPage,
    });

    this.props.form.setFieldsValue({ email: '' });
  };

  handleCaptcha = captchaVal => {
    this.setState({ captchaVal });
  };

  handleSubmit = e => {
    const {
      login,
      form: { validateFields },
    } = this.props;

    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }

      if (OPEN_RECAPTCHA_CHECK === 'true') {
        if (!this.state.captchaVal) {
          Modal.warning({
            title: '請點選我不是Robot',
            content: '請點選驗證',
          });
          return;
        }
      }

      login({
        loginId: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });
    });
  };

  handleForgetPassword = e => {
    const {
      forgotpassword,
      form: { validateFields },
      forgotpwd,
    } = this.props;

    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      } else {
        if (!forgotpwd.isDone && !forgotpwd.isLoading) {
          forgotpassword({
            email: values.email,
          });
        }
      }
    });
  };

  renderForm() {
    const { currentPage } = this.state;
    if (currentPage === FORGET_PASSWORD) {
      return this.renderForgetPasswordForm();
    } else {
      return this.renderLoginRegisterForm();
    }
  }

  renderForgetPasswordForm() {
    const {
      form: { getFieldDecorator },
      forgotpwd,
    } = this.props;

    if (forgotpwd.isDone && !forgotpwd.isLoading) {
      if (forgotpwd.errMsg === '') {
        Modal.info({
          title: '',
          content: '系統已發送密碼設定連結至您的信箱',
          onOk: () => {
            this.handleSwitchPage(LOGIN_PAGE);
          },
        });
      } else {
        this.handleSwitchPage(LOGIN_PAGE);
      }
    }

    return (
      <Form onSubmit={this.handleForgetPassword} hideRequiredMark={true}>
        <div className="title_01 mb_32">忘記密碼</div>
        <Row>
          <FormItem className="label-email" label="E-mail" colon={false}>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'E-mail格式不合',
                },
                {
                  required: true,
                  message: '必填欄位',
                },
              ],
            })(<Input type="email" placeholder="請輸入您的E-mail" />)}
          </FormItem>
        </Row>

        <RowM type="flex" justify="center">
          <StyleButton
            className="btn_type_h40"
            type="darkblue"
            text="取回密碼"
            loading={forgotpwd.isLoading}
            htmlType="submit"
          />
        </RowM>

        <RowM type="flex" justify="end">
          <Link className="link" onClick={() => this.props.history.push(REGISTER)}>
            註冊
          </Link>
        </RowM>
      </Form>
    );
  }

  renderLoginRegisterForm() {
    const {
      form: { getFieldDecorator },
      auth,
      isLoginFailed,
      rememberUserId,
    } = this.props;
    const isLoading = auth.isLoading;

    const controls = [];

    controls.push(
      <Link
        key="register"
        style={{ marginRight: 24 }}
        onClick={() => this.props.history.push(REGISTER)}>
        註冊
      </Link>,
      <Link key="forget" onClick={() => this.handleSwitchPage(FORGET_PASSWORD)}>
        忘記密碼
      </Link>,
    );

    return (
      <Form onSubmit={this.handleSubmit} hideRequiredMark={true}>
        <div className="title_01 mb_32">登入</div>
        <Row>
          <FormItem className="label-email" label="E-mail" colon={false}>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: 'E-mail格式不合',
                },
                {
                  required: true,
                  message: '必填欄位',
                },
              ],
              initialValue: rememberUserId,
            })(<Input type="email" placeholder="請輸入您的E-mail" />)}
          </FormItem>
        </Row>

        <RowM>
          <FormItem label="密碼" colon={false}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '必填欄位',
                },
              ],
            })(<Input type="password" placeholder="請輸入您的密碼" />)}
          </FormItem>
        </RowM>

        {OPEN_RECAPTCHA_CHECK === 'true' ? (
          <RowM type="flex" justify="end" className="mt_50">
            <ReCAPTCHA
              ref="recaptcha"
              sitekey={GOOGLE_RECAPTCHA_KEY}
              onChange={this.handleCaptcha}
            />
          </RowM>
        ) : null}

        <RowM type="flex" justify="end" className="mb_51 mt_17">
          {getFieldDecorator('rememberMe', {
            initialValue: !isNil(rememberUserId),
            valuePropName: 'checked',
          })(<Checkbox className="font_style_14">記住我</Checkbox>)}
        </RowM>

        <RowM type="flex" justify="center">
          <StyleButton
            className="btn_type_h40"
            type="darkblue"
            text="登入"
            loading={isLoading}
            htmlType="submit"
          />
          {isLoginFailed && (
            <span style={{ color: 'red', paddingLeft: '8px' }}>帳號或密碼錯誤！</span>
          )}
        </RowM>

        <RowM type="flex" justify="end" className="mt_9">
          {controls}
        </RowM>
      </Form>
    );
  }

  render() {
    const { isInitCookieAuth } = this.props;

    if (isInitCookieAuth) {
      return null;
    }

    return <StyledModal title="登入">{this.renderForm()}</StyledModal>;
  }
}
