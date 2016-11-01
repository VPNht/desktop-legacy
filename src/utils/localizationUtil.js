import {ipcRenderer} from 'electron';

const localization = {
    init: function () {
        let availableLocales = ['en', 'fr'],
            detectedLocale = false,
            pureLanguage = navigator.language.toLowerCase(),
            baseLanguage = pureLanguage.slice(0, 2);

        // autodetection
        if (availableLocales.indexOf(pureLanguage) !== -1) {
            detectedLocale = pureLanguage;
        } else if (availableLocales.indexOf(baseLanguage) !== -1) {
            detectedLocale = baseLanguage;
        } else {
            detectedLocale = 'en';
        }

        // load translations
        for (let i in availableLocales) {
            let l = availableLocales[i];
            try {
                sessionStorage[l] = JSON.stringify(require('../translations/'+l));
            } catch (e) {
                console.error('Unable to load language:', l);
            }
        }
        sessionStorage.locale = detectedLocale;

        // build tray
        ipcRenderer.send('localization.ready', sessionStorage[detectedLocale]);
    },
    t: function translate (str) {
        let tr = str;
        try {
            tr = JSON.parse(sessionStorage[sessionStorage.locale])[str];
        } catch (e) {
            console.error('Unable to translate:', str);
        }
        return tr;
    }
}

module.exports = localization;