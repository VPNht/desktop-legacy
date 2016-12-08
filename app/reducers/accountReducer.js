import { types } from '../actions/accountActions';

const defaultState = {
  errors: {},
  connected: false,
  connecting: false,
  appReady: false,
  myip: false,
  bytecount: [0, 0],
  connectionTime: 0,
  username: '',
  password: ''
};

export default function AccountReducer(state = defaultState, action) {
  switch (action.type) {
    case types.APP_READY:
      return {
        ...state,
        appReady: action.payload
      };
    default:
      return state;
  }
}
