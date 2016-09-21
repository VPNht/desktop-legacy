
let instance = null;

class SettingsUtil {

  static get instance() {
    if (!insance) instance = this;
    return insance;
  }

  get(item) {
    let value = localStorage.getItem(`settings.${item}`);

    try {
      value = JSON.parse(value);
    } catch (e) {
      if (value === 'true' || 'false') value = (value === 'true') ? true : false;
    }

    // if (defaultSettings[item] && value === null) value = defaultSettings[item];

    return value;
  }

  save(key, value) {
    localStorage.setItem(`settings.${key}`, JSON.stringify(value));
  }

}

export default new SettingsUtil;
