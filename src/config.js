import Config from 'electron-config';

const defaults = {
    username: '',
    password: '',
    hasMetrics: false,
    launchAtStartup: false,
    launchAtStartupHidden: true,
    connectAtLaunch: false,
    saveCredentials: false,
    disableSmartDNS: false,
    autoPath: true,
    encryption: 128,
    port: 0,
    minimizeToTaskbar: false
};

export default new Config({
  defaults
});