const defaultState = {
  errors: {},
  connected: false,
  connecting: false,
  appReady: false,
  myip: false,
  bytecount: [0, 0],
  connectionTime: 0
};

export default function AccountReducer(state = defaultState, action) {
  switch (action.type) {
    case 'APP_READY':
      return {
        ...state,
        apReady: action.payload
      };
    default:
      return state;
  }
}
