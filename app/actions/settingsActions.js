export const types = {
  TOGGLE_AUTO_PATH: 'TOGGLE_AUTO_PATH',
  TOGGLE_CONNECT_LAUNCH: 'TOGGLE_CONNECT_LAUNCH',
  TOGGLE_SMART_DNS: 'TOGGLE_SMART_DNS',
  CHANGE_ENCRYPTION: 'CHANGE_ENCRYPTION',
  TOGGLE_LAUNCH_STARTUP: 'TOGGLE_LAUNCH_STARTUP',
  TOGGLE_STARTUP_HIDDEN: 'TOGGLE_STARTUP_HIDDEN',
  TOGGLE_METRICS: 'TOGGLE_METRICS',
  TOGGLE_MIN_TASKBAR: 'TOGGLE_MIN_TASKBAR',
  TOGGLE_SAVE_CREDENTIALS: 'TOGGLE_SAVE_CREDENTIALS'
};

export function toggleAutoPath(autoPath) {
  return {
    type: TOGGLE_AUTO_PATH,
    payload: !autoPath
  };
}

export function toggleConnectLaunch(connectLaunch) {
  return {
    type: TOGGLE_CONNECT_LAUNCH,
    payload: !connectLaunch
  };
}

export function toggleSmartDNS(disableSmartdns) {
  return {
    type: TOGGLE_SMART_DNS,
    payload: !disableSmartdns
  };
}

export function changeEncryption(encryption) {
  return {
    type: CHANGE_ENCRYPTION,
    payload: encryption
  };
}

export function toggleLaunchStartup(launchStartup) {
  return {
    type: TOGGLE_LAUNCH_STARTUP,
    payload: !launchStartup
  };
}

export function toggleStartupHidden(launchStartupHidden) {
  return {
    type: TOGGLE_STARTUP_HIDDEN,
    payload: !launchStartupHidden
  };
}

export function toggleMetrics(metricsEnabled) {
  return {
    type: TOGGLE_METRICS,
    payload: !metricsEnabled
  };
}

export function toggleMinTaskbar(minToTaskbar) {
  return {
    type: TOGGLE_MIN_TASKBAR,
    payload: !minToTaskbar
  };
}

export function toggleSaveCredentials(saveCredentials) {
  return {
    type: TOGGLE_SAVE_CREDENTIALS,
    payload: !saveCredentials
  };
}
