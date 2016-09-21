import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import accountReducer from './accountReducer';
import serverReducer from './serverReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  routing,
  accountReducer,
  serverReducer,
  settingsReducer
});

export default rootReducer;
