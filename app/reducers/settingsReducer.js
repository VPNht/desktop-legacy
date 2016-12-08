import SettingsUtil from '../utils/SettingsUtil';
import { types } from '../actions/settingsActions';

const autoPath = SettingsUtil.get('autoPath');
const connectLaunch = SettingsUtil.get('connectLaunch');
const disableSmartdns = SettingsUtil.get('disableSmartdns');
const encryption = SettingsUtil.get('encryption');
const launchStartup = SettingsUtil.get('launchStartup');
const launchStartupHidden = SettingsUtil.get('launchStartupHidden');
const metricsEnabled = SettingsUtil.get('metricsEnabled');
const minToTaskbar = SettingsUtil.get('minToTaskbar');
const saveCredentials = SettingsUtil.get('saveCredentials');

const defaultState = {
  autoPath: autoPath !== null ? autoPath : true,
  connectLaunch: connectLaunch !== null ? connectLaunch : false,
  disableSmartdns: disableSmartdns !== null ? disableSmartdns : false,
  encryption: encryption !== null ? encryption : {
    value: 256,
    label: '256 BIT AES'
  },
  launchStartup: launchStartup !== null ? launchStartup : false,
  launchStartupHidden: launchStartupHidden !== null ? launchStartupHidden : true,
  metricsEnabled: metricsEnabled !== null ? metricsEnabled : false,
  minToTaskbar: minToTaskbar !== null ? minToTaskbar : true,
  saveCredentials: saveCredentials !== null ? saveCredentials : false
};

export default function SettingsReducer(state = defaultState, action) {
  switch (action.type) {
    case types.TOGGLE_AUTO_PATH:
      return {
        ...state,
        autoPath: action.payload
      };
    case types.TOGGLE_CONNECT_LAUNCH:
      return {
        ...state,
        connectLaunch: action.payload
      };
    case types.TOGGLE_SMART_DNS:
      return {
        ...state,
        disableSmartdns: action.payload
      };
    case types.CHANGE_ENCRYPTION:
      return {
        ...state,
        encryption: action.payload
      };
    case types.TOGGLE_LAUNCH_STARTUP:
      return {
        ...state,
        launchStartup: action.payload
      };
    case types.TOGGLE_STARTUP_HIDDEN:
      return {
        ...state,
        launchStartupHidden: action.payload
      };
    case types.TOGGLE_METRICS:
      return {
        ...state,
        metricsEnabled: action.payload
      };
    case types.TOGGLE_MIN_TASKBAR:
      return {
        ...state,
        minToTaskbar: action.payload
      };
    case types.TOGGLE_SAVE_CREDENTIALS:
      return {
        ...state,
        saveCredentials: action.payload
      };
    default:
      return state;
  }
}
