import fs from 'fs';
import Mixpanel from 'mixpanel';
import os from 'os';
import osxRelease from 'osx-release';
import path from 'path';
import uuid from 'node-uuid';

import {
  isWindows,
  packageJson,
  settingsJson
} from './';

export default class Metrics {

  constructor() {
    const settings = settingsJson();
    let token = process.env.NODE_ENV === 'development' ? settings['mixpanel-dev'] : settings.mixpanel;
    if (!token) token = 'none';
    this._mixpanel = Mixpanel.init(token);

    if (localStorage.getItem('metrics.enabled') === null) localStorage.setItem('metrics.enabled', true);
  }

  enabled() {
    return localStorage.getItem('metrics.enabled') === 'true';
  }

  setEnabled(enabled) {
    localStorage.setItem('metrics.enabled', !!enabled);
  }

  track(name, data) {
    data = data || {};

    if (!name) return;
    if (localStorage.getItem('metrics.enabled') !== 'true') return;

    let id = localStorage.getItem('metrics.id');
    if (!id) {
      id = uuid.v4();
      localStorage.setItem('metrics.id', id);
    }

    const osName = os.platform();
    const osVersion = isWindows() ? os.release() : osxRelease(os.release()).version;

    const packagejson = packageJson();
    this._mixpanel.track(name, Object.assign({
      distinct_id: id,
      version: packagejson.version,
      'Operating System': osName,
      'Operating System Version': osVersion,
      'Operating System Architecture': os.arch()
    }, data));
  }

}
