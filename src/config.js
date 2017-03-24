import Config from 'electron-config';

const defaults = {
    launchStartup: false,
    launchStartupHidden: true,
    connectLaunch: false,
    saveCredentials: false,
    disableSmartdns: false,
    autoPath: true,
    encryption: 128,
    minToTaskbar: true
};

export default new Config({
  defaults
});