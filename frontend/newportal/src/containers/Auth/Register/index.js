import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StyleButton from 'components/Button';
import { connect } from 'react-redux';
import ReCAPTCHA from 'react-google-recaptcha';
import { Form, Input, Modal, Row, Checkbox } from 'antd';
import { register } from 'reducers/register';
import { StyledModal, Link, RowM, FormItem } from '../components';
import { AGREEMENT } from 'constants/routes';
import { GOOGLE_RECAPTCHA_KEY, OPEN_RECAPTCHA_CHECK, TAIPEI_HOST } from 'constants/endpoint';

const mapStateToProps = state => ({
  auth: state.auth,
  reg: state.register,
  isInitCookieAuth: state.views.isInitCookieAuth,
});

const mapDispatchToProps = {
  register,
};

@connect(
  mapStateToProps,
  mapDispatchToProps,
)
@Form.create()
export default class RegisterPage extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    reg: PropTypes.object.isRequired,
    isInitCookieAuth: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    const taipeiUrl = window.location.hostname.indexOf(TAIPEI_HOST);

    this.state = {
      isAuthenticated: props.auth.isAuthenticated,
      captchaVal: undefined,
      isAgreement: taipeiUrl > -1,
    };
  }

  handleSwitchPage = () => {
    this.props.history.push('/');
  };

  handleCaptcha = captchaVal => {
    this.setState({ captchaVal });
  };

  handleSubmit = e => {
    const {
      register,
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

      register({
        email: values.email,
        name: values.name,
      });
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
      auth,
      reg,
    } = this.props;
    const { isAgreement } = this.state;

    const isLoading = reg.isLoading || auth.isLoading;

    const controls = [];

    controls.push(
      <Link key="login" onClick={this.handleSwitchPage}>
        已有帳號
      </Link>,
    );

    return (
      <Form onSubmit={this.handleSubmit} hideRequiredMark={true}>
        <div className="title_01 mb_32">註冊</div>
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

        <RowM>
          <FormItem label="名稱" colon={false}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '必填欄位',
                },
              ],
            })(<Input type="text" placeholder="請輸入您的姓名" />)}
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

        {isAgreement && (
          <RowM type="flex" justify="end" className="mt_17">
            <FormItem>
              {getFieldDecorator('checkedAgreement', {
                rules: [
                  {
                    required: true,
                    message: '您未確認同意條款',
                    transform: value => value || undefined,
                    type: 'boolean',
                  },
                ],
                valuePropName: 'checked',
              })(
                <Checkbox style={{ fontSize: 14 }}>
                  我同意
                  <a
                    href={AGREEMENT} // eslint-disable-next-line react/jsx-no-target-blank
                    target="_blank"
                    rel="noopener norefferrer">
                    服務條款及隱私權政策
                  </a>
                </Checkbox>,
              )}
            </FormItem>
          </RowM>
        )}

        <RowM type="flex" justify="center">
          <StyleButton
            className="btn_type_h40"
            type="darkblue"
            text="註冊"
            disabled={reg.isDone && !reg.isRegisterFailed}
            loading={isLoading}
            htmlType="submit"
          />
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

    return <StyledModal title="註冊">{this.renderForm()}</StyledModal>;
  }
}
