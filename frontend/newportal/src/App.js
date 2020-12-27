import React from 'react';
import { I18nextProvider } from 'react-i18next'
import initialI18nInstance from 'locales/i18n'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Layout, Modal } from 'antd';
import { logout } from 'reducers/auth';
import { AppHeader } from 'components';
import { NotFound, CheckAuth } from 'containers';
import RegisterActivePage from 'containers/Auth/RegisterActive';
import EmailReplacePage from 'containers/Auth/EmailReplace';
import ActivityManagement from 'containers/ActivityManagement';
import Forgotpassword from 'containers/Auth/Restpass';
import CardManagement from 'containers/CardManagement';
import GuardAreaManagement from 'containers/GuardAreaManagement';
import OAuth from 'containers/OAuth';
import { shouldDisplayError } from 'utils/NormalError';
import {
  ACTIVITY_MANAGEMENT,
  CARD_MANAGEMENT,
  REGISTER_ACTIVE,
  RESETPASS,
  SAVEAREA_MANAGEMENT,
  EMAIL_REPLACE,
  OAUTH,
} from 'constants/routes';
import { APP_TITLE } from 'constants/endpoint';
import GlobalStyles from './GlobalStyles';

const { Content } = Layout;

const mapStateToProps = (state) => ({
  isServerError: state.views.isServerError,
  error: state.views.error,
});

const mapDispatchToProps = {
  logout,
};

@CheckAuth
@connect(mapStateToProps, mapDispatchToProps)
class App extends React.Component {  
  static propTypes = {
    isServerError: PropTypes.bool.isRequired,
    logout: PropTypes.func.isRequired,
  };

  componentDidMount() {
    document.title = APP_TITLE;
  }

  handleApiRequestError = (prevProps) => {
    const {
      logout,
      error: {
        timestamp: prevOccurTime,
        response: { message: prevErrMsg },
      },
    } = prevProps;
    const {
      error: {
        timestamp: currOccurTime,
        status: currStatusCode,
        response: { message: currErrMsg },
      },
    } = this.props;

    if (currErrMsg === 'Unauthorized') {
      // if (currErrMsg !== prevErrMsg) {
      //   Modal.error({
      //     content: t('common:請重新登入'),
      //   });
      // }
      logout();
    } else if (
      shouldDisplayError(currStatusCode) &&
      (currErrMsg !== prevErrMsg ||
        (currErrMsg === prevErrMsg && currOccurTime - prevOccurTime > 1500))
    ) {
      Modal.error({
        title: 'Server Error',
        content: currErrMsg,
      });
    }
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    this.handleApiRequestError(prevProps);
  };

  render() {
    const { pageProps } = this.props
    const { i18n } = pageProps || {}

    const {
      history: {
        location: { pathname },
      },
    } = this.props;
    const showNavbar = pathname !== `/${OAUTH}`;

    return (
      <I18nextProvider i18n={i18n || initialI18nInstance}>
        <Layout>
          <GlobalStyles />
          {showNavbar && <AppHeader />}
          <Content>
            <Switch>
              <Route exact path="/" component={ActivityManagement} />
              <Route path={`${RESETPASS}/:subPath`} component={Forgotpassword} />
              <Route path={`${REGISTER_ACTIVE}/:subPath`} component={RegisterActivePage} />
              <Route path={`${EMAIL_REPLACE}/:subPath`} component={EmailReplacePage} />
              <Route path={`/${ACTIVITY_MANAGEMENT}/:subPath`} component={ActivityManagement} />
              <Route path={`/${CARD_MANAGEMENT}/:subPath`} component={CardManagement} />
              <Route path={`/${SAVEAREA_MANAGEMENT}/:subPath`} component={GuardAreaManagement} />
              <Route path={`/${OAUTH}`} component={OAuth} />
              <Route component={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </I18nextProvider>
    );
  }
}

export default App;
