import { app } from 'electron';
import Updater from 'autoupdater'

 // auto update
var autoUpdater = new Updater({
  currentVersion: app.getVersion()
});

autoUpdater.on("download", function(version) {
    console.log("Downloading " + version)
});

autoUpdater.on("updateReady", function(updaterPath) {
    console.log("Launching " + updaterPath);
    dialog.showMessageBox(mainWindow, {
        'type': 'info',
        message: 'A new version is available, do you want to install now ?',
        buttons: ['Yes', 'No']
    }, function(response) {

        if (response === 0) {
            if (process.platform == 'win32') {
                util.exec('start ' + updaterPath).then(function(stdOut) {
                    console.log(stdOut);
                    process.exit(0);
                });
            } else {
                child_process.spawn('open', [updaterPath], {
                    detached: true,
                    stdio: ['ignore', 'ignore', 'ignore']
                });
                process.exit(0);
            }
        }
    })
});

autoUpdater.on('error', function(err) {
    console.log('An error occured while checking for updates.');
    console.log(err);
});

// do not trigger for nothing
if (process.env.NODE_ENV !== 'development') {
    autoUpdater.update();
}