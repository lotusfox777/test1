import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { createLogger } from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'connected-react-router';
import rootEpic from '../reducers/rootEpic';
import createRootReducer from 'reducers';

export const history = createHistory();
const middleware = routerMiddleware(history);
const logger = createLogger({
  collapsed: true,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () => {
  const store = createStore(
    createRootReducer(history),
    composeEnhancers(applyMiddleware(middleware, createEpicMiddleware(rootEpic), logger)),
  );
  return store;
};

export default configureStore;
