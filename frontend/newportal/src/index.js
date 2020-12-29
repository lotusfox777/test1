import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider } from 'styled-components';
import Cookies from 'js-cookie';
import App from './App';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { loginInit } from './reducers/auth';
import zh_TW from 'antd/lib/locale-provider/zh_TW';
import { queryString } from './utils/webHelper';
import { isProd, mobileAppUrl } from 'constants/endpoint';
import theme from './theme';
import { DrawerProvider } from './drawer-context';
import { unregister } from './registerServiceWorker';
import configureStore, { history } from './store';

import './locales/i18n';

const isMobile = false;
const shouldRedirect = isMobile && isProd;

if (shouldRedirect) {
  window.location = mobileAppUrl;
}

if (!shouldRedirect) {
  const { token, url, loginId } = queryString(history.search);
  const userModalVisible = url === 'edit-pass';

  if (token && loginId) {
    Cookies.set('_dplusToken', token);
    Cookies.set('_dplusUserId', loginId);
  }

  if (url) {
    history.replace(userModalVisible ? '/' : url);
  }

  const store = configureStore();

  store.dispatch(loginInit());

  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ConfigProvider locale={zh_TW}>
          <ConnectedRouter history={history}>
            <DrawerProvider accountModalVisible={userModalVisible}>
              <App />
            </DrawerProvider>
          </ConnectedRouter>
        </ConfigProvider>
      </ThemeProvider>
    </Provider>,
    document.getElementById('root'),
  );

  unregister();
}
