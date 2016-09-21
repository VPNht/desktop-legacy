import SettingsUtil from '../utils/SettingsUtil';
import { types } from '../actions/settingsActions';

const defaultState = {
  autoPath: SettingsUtil.get('autoPath') ? SettingsUtil.get('autoPath') : true,
  connectLaunch: SettingsUtil.get('connectLaunch') ? SettingsUtil.get('connectLaunch') : false,
  disableSmartdns: SettingsUtil.get('disableSmartdns') ? SettingsUtil.get('disableSmartdns') : false,
  encryption: SettingsUtil.get('encryption') ? SettingsUtil.get('encryption') : {
    value: 256,
    label: '256 BIT AES'
  },
  launchStartup: SettingsUtil.get('launchStartup') ? SettingsUtil.get('launchStartup') : false,
  launchStartupHidden: SettingsUtil.get('launchStartupHidden') ? SettingsUtil.get('launchStartupHidden') : true,
  metricsEnabled: SettingsUtil.get('metricsEnabled') ? SettingsUtil.get('metricsEnabled') : false,
  minToTaskbar: SettingsUtil.get('minToTaskbar') ? SettingsUtil.get('minToTaskbar') : true,
  saveCredentials: SettingsUtil.get('saveCredentials') ? SettingsUtil.get('saveCredentials')  : false
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
