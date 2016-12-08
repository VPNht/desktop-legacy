import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import accountReducer from './accountReducer';
import logReducer from './logReducer';
import serverReducer from './serverReducer';
import settingsReducer from './settingsReducer';

const rootReducer = combineReducers({
  routing,
  accountReducer,
  logReducer,
  serverReducer,
  settingsReducer
});

export default rootReducer;
