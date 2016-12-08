import SettingsUtil from '../utils/SettingsUtil';
import { types } from '../actions/serverActions';

const server = SettingsUtil.get('server');

const defaultState = {
  server: server !== null ? server : {
    value: 'hub.vpn.ht',
    label: 'Nearest Server (Random)',
    country: 'blank'
  },
  servers: [{
    value: 'hub.vpn.ht',
    label: 'Nearest Server (Random)',
    country: 'blank'
  }],
  error: null
};

export default function ServerReducer(state = defaultState, action) {
  switch (action.type) {
    case types.FETCH_SERVERS:
      return {
        ...state,
        servers: action.payload
      };
    case types.ERROR_SERVERS:
      return {
        ...state,
        error: action.payload
      };
    case types.CHANGE_SERVER:
      return {
        ...state,
        server: action.payload
      };
    default:
      return state;
  }
}
