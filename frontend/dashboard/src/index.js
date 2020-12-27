import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { StoreContext } from 'redux-react-hook';
import { ConfigProvider } from 'antd';
import { loginInit } from './reducers/auth';
import zh_TW from 'antd/lib/locale-provider/zh_TW';
import { unregister } from './registerServiceWorker';
import configureStore, { history } from './store';

const store = configureStore();

store.dispatch(loginInit());


ReactDOM.render(
  <Provider store={store}>
    <StoreContext.Provider value={store}>
      <ConfigProvider locale={zh_TW}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </ConfigProvider>
    </StoreContext.Provider>
  </Provider>,
  document.getElementById('root')
);

unregister();
