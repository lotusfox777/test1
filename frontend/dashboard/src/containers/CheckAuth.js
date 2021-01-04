import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { Form, Icon, Input, Button, Modal } from 'antd';
import * as actions from 'actions';
import { getFunc } from 'constants/functions';
import { checkUserAuth } from 'utils/authentication';

const FormItem = Form.Item;

const mapStateToProps = (state) => ({
  auth: state.auth,
  isLoading: state.auth.isLoading,
  isLoginFailed: state.auth.isLoginFailed,
  isInitCookieAuth: state.views.isInitCookieAuth,
});

const mapDispatchToProps = {
  login: actions.login,
};

const StyledModal = styled(Modal).attrs({
  title: 'PUI backstage management Login',
  bordered: false,
  visible: true,
  footer: false,
})`
  max-width: 500px;
  margin: 0 auto;

  .ant-card-head-title {
    font-size: 20px;
    text-align: center;
  }
`;

export default (WrappedComponent) => {
  @withRouter
  @connect(mapStateToProps, mapDispatchToProps)
  @Form.create()
  class CheckAuth extends PureComponent {
    static propTypes = {
      auth: PropTypes.object.isRequired,
      login: PropTypes.func.isRequired,
      isLoading: PropTypes.bool.isRequired,
      isLoginFailed: PropTypes.bool.isRequired,
    };

    constructor(props) {
      super(props);
      this.state = {
        isAuthenticated: props.auth.isAuthenticated,
      };
    }

    componentWillMount() {
      const { auth } = this.props;
      if (auth.isAuthenticated) {
      }
    }

    isAuthenticatedRoute = () => {
      const {
        location: { pathname },
        auth: { permissions },
      } = this.props;

      if (pathname === '/') {
        return true;
      }

      return checkUserAuth({ permissions, func: getFunc(pathname) });
    };

    handleSubmit = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.props.login({
            loginId: values.userName,
            password: values.password,
          });
        }
      });
    };

    render() {
      const {
        auth,
        form: { getFieldDecorator },
        history,
        match,
        isLoading,
        isLoginFailed,
        isInitCookieAuth,
      } = this.props;

      if (isInitCookieAuth) {
        return null;
      }

      if (!this.isAuthenticatedRoute()) {
        return <Redirect to="/" />;
      }

      if (auth.isAuthenticated) {
        return <WrappedComponent history={history} match={match} />;
      }

      return (
        <StyledModal>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: '帳號為必填欄位' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ fontSize: 13 }} />}
                  placeholder="請輸入帳號"
                />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '密碼為必填欄位' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
                  type="password"
                  placeholder="請輸入密碼"
                />,
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
                loading={isLoading}>
                登入
              </Button>
              {isLoginFailed && (
                <span style={{ color: 'red', paddingLeft: '8px' }}>
                  帳號或密碼錯誤！
                </span>
              )}
            </FormItem>
          </Form>
        </StyledModal>
      );
    }
  }
  return CheckAuth;
};
