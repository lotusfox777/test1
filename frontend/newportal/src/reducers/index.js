import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import auth from './auth';
import views from './views';
import cards from './cards';
import device from './device';
import ufos from './ufos';
import guardAreas from './guardAreas';
import users from './users';
import managers from './managers';
import register from './register';
import forgotpassword from './forgotpassword';
import cardGroups from './cardGroups';

export default history =>
  combineReducers({
    auth,
    views,
    cards,
    device,
    ufos,
    guardAreas,
    users,
    managers,
    router: connectRouter(history),
    register,
    forgotpassword,
    cardGroups,
  });
