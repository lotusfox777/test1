import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'connected-react-router'
import rootEpic from '../reducers/rootEpic';
import createRootReducer from 'reducers';

export const history = createHistory();

const configureStore = () => {

  const middleware = routerMiddleware(history);

  const store = createStore(
    createRootReducer(history), // root reducer with router state
    compose(
      applyMiddleware(middleware, createEpicMiddleware(rootEpic))
    )
  );
  return store;
};

export default configureStore;
