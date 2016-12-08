import { createStore, applyMiddleware, compose } from 'redux';
import { hashHistory } from 'react-router';
import { persistState } from 'redux-devtools';
import { routerMiddleware } from 'react-router-redux';
import Logger from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const router = routerMiddleware(hashHistory);

const enhancer = compose(
  applyMiddleware(thunk, router, new Logger()),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => store.replaceReducer(require('../reducers')));
  }

  return store;
}
