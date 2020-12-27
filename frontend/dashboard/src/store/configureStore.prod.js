import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import rootEpic from '../reducers/rootEpic';
import createRootReducer from 'reducers';

export const history = createBrowserHistory();

const configureStore = () => {
  const store = createStore(
    createRootReducer(history),
    compose(applyMiddleware(routerMiddleware(history), createEpicMiddleware(rootEpic))),
  );

  return store;
};

export default configureStore;
