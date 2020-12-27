import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getCurrentUser } from 'reducers/users';
import { REGISTER_ACTIVE, RESETPASS, AGREEMENT } from 'constants/routes';
import { TAIPEI_HOST, APP_TITLE } from 'constants/endpoint';
import AuthPage from 'containers/Auth/index';
import Agreement from './Agreement';

const mapStateToProps = state => ({
  auth: state.auth,
  isLoading: state.auth.isLoading,
  isLoginFailed: state.auth.isLoginFailed,
  isInitCookieAuth: state.views.isInitCookieAuth,
});

const mapDispatchToProps = { getCurrentUser };

export default WrappedComponent => {
  @withRouter
  @connect(
    mapStateToProps,
    mapDispatchToProps,
  )
  class CheckAuth extends React.Component {
    static propTypes = {
      isLoading: PropTypes.bool.isRequired,
      isLoginFailed: PropTypes.bool.isRequired,
    };

    constructor(props) {
      super(props);

      const isRegisterActive = window.location.pathname.startsWith(REGISTER_ACTIVE);
      const isResetPass = window.location.pathname.startsWith(RESETPASS);

      const isAgreement = window.location.pathname.startsWith(AGREEMENT);

      this.state = {
        isRegisterActive,
        isAuthenticated: props.auth.isAuthenticated,
        isResetPass,
        isAgreement,
      };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const {
        location: { pathname },
      } = nextProps;

      if (pathname.startsWith(REGISTER_ACTIVE) && !prevState.isRegisterActive) {
        return { isRegisterActive: true };
      }
      if (pathname.startsWith(RESETPASS) && !prevState.isResetPass) {
        return { isResetPass: true };
      }
      if (pathname.startsWith(AGREEMENT) && !prevState.isAgreement) {
        return { isAgreement: true };
      }
      if (!pathname.startsWith(RESETPASS) && !pathname.startsWith(REGISTER_ACTIVE)) {
        return {
          isResetPass: false,
          isRegisterActive: false,
        };
      }
      return null;
    }

    componentDidMount = () => {
      if (this.props.auth.isAuthenticated) {
        this.props.getCurrentUser();
      }

      document.title = APP_TITLE;
    };

    componentDidUpdate = (prevProps, prevState) => {
      if (!prevProps.auth.isAuthenticated && this.props.auth.isAuthenticated) {
        this.props.getCurrentUser();
      }
    };

    render() {
      const {
        auth: { isAuthenticated },
        isInitCookieAuth,
        history,
        match,
      } = this.props;
      const { isRegisterActive, isResetPass, isAgreement } = this.state;

      const taipeiUrl = window.location.hostname.indexOf(TAIPEI_HOST);

      if (isInitCookieAuth) {
        return null;
      }

      if (isAgreement && taipeiUrl > -1) {
        return <Agreement />;
      }

      if (!isAuthenticated && !isRegisterActive && !isResetPass) {
        return <AuthPage />;
      }

      return <WrappedComponent history={history} match={match} />;
    }
  }
  return CheckAuth;
};
