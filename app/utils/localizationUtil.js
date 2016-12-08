import { ipcRenderer } from 'electron';

export function initLocalization() {
  const availableLocales = ['en', 'fr'];
  let detectedLocale = false;
  const pureLanguage = navigator.language.toLowerCase();
  const baseLanguage = pureLanguage.slice(0, 2);

  if (availableLocales.indexOf(pureLanguage) !== -1) {
    detectedLocale = pureLanguage;
  } else if (availableLocales.indexOf(baseLanguage) !== -1) {
    detectedLocale = baseLanguage;
  } else {
    detectedLocale = 'en';
  }

  for (let i in availableLocales) {
    const l = availableLocales[i];
    try {
      sessionStorage[l] = JSON.stringify(require(`../translations/${l}`));
    } catch (err) {
      console.error(`Unable to load language: ${l}`);
    }
  }

  sessionStorage.locale = detectedLocale;
  ipcRenderer.send('localization.ready', sessionStorage[detectedLocale]);
}

export function translate(str) {
  let tr = str;
  try {
    tr = JSON.parse(sessionStorage[sessionStorage.locale])[str] || tr;
  } catch (err) {
    console.error(`Unable to translate '${str}' because ${err}`);
  }
  return tr;
}
