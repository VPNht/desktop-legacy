import { remote } from 'electron';
import bugsnag from 'bugsnag-js';
import fs from 'fs';
import path from 'path';

import {
  removeSensitiveData,
  settingsJson
} from './';
import MetricsUtil from './MetricsUtil';

const { app } = remote;

export default class WebUtil {

  constructor() {
    this._metrics = new MetricsUtil();
  }

  addBugReporting() {
    const settingsjson = settingsJson();

    if (settingsjson.bugsnag) {
      bugsnag.apiKey = settingsjson.bugsnag;
      bugsnag.autoNotify = true;
      bugsnag.releaseStage = process.env.NODE_ENV === 'development' ? 'development' : 'production';
      bugsnag.notifyReleaseStages = ['production'];
      bugsnag.appVersion = app.getVersion();
      bugsnag.metaData = {
        beta: !!settingsjson.beta
      };

      bugsnag.beforeNotify = payload => {
        if (!this._metrics.enabled()) return false;

        payload.stacktrace = removeSensitiveData(payload.stacktrace);
        payload.context = removeSensitiveData(payload.context);
        payload.file = removeSensitiveData(payload.file);
        payload.message = removeSensitiveData(payload.message);
        payload.url = removeSensitiveData(payload.url);
        payload.name = removeSensitiveData(payload.name);
        payload.file = removeSensitiveData(payload.file);

        for (let key in payload.metaData) {
          payload.metaData[key] = removeSensitiveData(payload.metaData[key]);
        }
      };
    }
  }

  disableGlobalBackspace() {
    document.onkeydown = event => {
      event = event || window.event;

      let doPrevent;
      if (event.keyCode === 8) {
        const d = event.srcElement || event.target;
        if (d.tagName.toUpperCase() === 'INPUT' || d.tagName.toUpperCase() === 'TEXTAREA') {
          doPrevent = d.readOnly || d.disabled;
        } else {
          doPrevent = true;
        }
      } else {
        doPrevent = false;
      }

      if (doPrevent) event.preventDefault();
    };
  }

}
