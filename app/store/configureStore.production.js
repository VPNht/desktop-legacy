import { createStore, applyMiddleware } from 'redux';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';

const router = routerMiddleware(hashHistory);
const enhancer = applyMiddleware(thunk, router);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
