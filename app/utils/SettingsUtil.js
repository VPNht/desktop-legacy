export default class SettingsUtil {

  static get(item) {
    let value = localStorage.getItem(`settings.${item}`);

    try {
      value = JSON.parse(value);
    } catch (err) {
      if (value === 'true' || 'false') value = (value === 'true') ? true : false;
    }

    // if (defaultSettings[item] && value === null) value = defaultSettings[item];

    return value;
  }

  static save(key, value) {
    localStorage.setItem(`settings.${key}`, JSON.stringify(value));
  }

}
