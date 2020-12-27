import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import auth from './auth';
import views from './views';
import cards from './cards';
import ufos from './ufos';
import guardAreas from './guardAreas';
import assistFinding from './assistFinding';
import users from './users';
import managers from './managers';

export default history =>
  combineReducers({
    auth,
    views,
    cards,
    ufos,
    guardAreas,
    users,
    managers,
    assistFinding,
    router: connectRouter(history),
  });
