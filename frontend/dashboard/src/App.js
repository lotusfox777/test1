import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { connect } from 'react-redux';
import * as actions from 'actions';
import { Route, Switch } from 'react-router-dom';
import { Layout, Modal } from 'antd';
import { SideMenu, AppHeader } from 'components';
import { normalize } from 'polished';
import { Home, NotFound, CheckAuth } from 'containers';
import CardManagement from 'containers/CardManagement';
import UserManagement from 'containers/UserManagement';
import DeviceManagement from 'containers/DeviceManagement';
import SystemManagement from 'containers/SystemManagement';
import MissingManagement from 'containers/AssistFindingManagement';
import {
  CARD_MANAGEMENT,
  MEMBER_MANAGEMENT,
  DEVICE_MANAGEMENT,
  SYSTEM_MANAGEMENT,
  ASSIST_FINDING_MANAGEMENT,
} from 'constants/routes';
import { APP_TITLE } from 'constants/endpoint';
import { shouldDisplayError } from 'utils/NormalError';
import { MarkerProvider } from './marker-context';

const { Footer, Sider, Content } = Layout;

const GlobalStyles = createGlobalStyle`
  ${normalize()};

  .bg-lightblue {
    background: #e6f7ff;
  }

  .cursor-pointer {
    cursor: pointer;
  }
`;

const fixedSiderStyle = {
  backgroundColor: 'white',
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  left: 0,
  zIndex: 100,
}; // need inline-style fix

const StyledRightLayout = styled(Layout)`
  height: 100vh;
  margin-left: 200px;
`;
const StyledContent = styled(Content)`
  padding-left: 16px;
`;

const mapStateToProps = (state) => ({
  isServerError: state.views.isServerError,
  error: state.views.error,
});

const mapDispatchToProps = {
  logout: actions.logout,
};

@CheckAuth
@connect(mapStateToProps, mapDispatchToProps)
class App extends PureComponent {
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
      t,
      error: {
        timestamp: currOccurTime,
        status: currStatusCode,
        response: { message: currErrMsg },
      },
    } = this.props;

    if (currErrMsg === 'Unauthorized') {
      if (currErrMsg !== prevErrMsg) {
        Modal.error({
          content: t('common:您的登入已過期，請重新登入'),
          zIndex: 1100,
        });
      }
      logout();
    } else if (
      shouldDisplayError(currStatusCode) &&
      (currErrMsg !== prevErrMsg ||
        (currErrMsg === prevErrMsg && currOccurTime - prevOccurTime > 1500))
    ) {
      Modal.error({
        title: t('common:伺服器錯誤'),
        content: currErrMsg,
      });
    }
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    this.handleApiRequestError(prevProps);
  };

  render() {
    return (
      <MarkerProvider>
        <Layout>
          <GlobalStyles />
          <Sider style={fixedSiderStyle}>
            <SideMenu />
          </Sider>
          <StyledRightLayout style={{ overflow: 'auto' }}>
            <AppHeader />
            <StyledContent>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route
                  path={`/${CARD_MANAGEMENT}/:subPath`}
                  component={CardManagement}
                />
                <Route
                  path={`/${MEMBER_MANAGEMENT}/:subPath`}
                  component={UserManagement}
                />
                <Route
                  path={`/${DEVICE_MANAGEMENT}/:subPath`}
                  component={DeviceManagement}
                />
                <Route
                  path={`/${SYSTEM_MANAGEMENT}/:subPath`}
                  component={SystemManagement}
                />
                <Route
                  path={`/${ASSIST_FINDING_MANAGEMENT}/:subPath`}
                  component={MissingManagement}
                />
                <Route component={NotFound} />
              </Switch>
            </StyledContent>
            <Footer>
              <p />
            </Footer>
          </StyledRightLayout>
        </Layout>
      </MarkerProvider>
    );
  }
}

export default withTranslation()(App);
