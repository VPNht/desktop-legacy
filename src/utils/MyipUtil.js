import _ from 'underscore';
import request from 'request';
import metrics from './MetricsUtil';

let MYIP_ENDPOINT = process.env.MYIP_ENDPOINT || 'https://myip.ht';

module.exports = {
  init: function () {},

  servers: function (callback) {
    request.get(`${MYIP_ENDPOINT}/servers-geo.json`, (error, response, body) => {
      callback(error, response, body);
    });
  },

  status: function (callback) {
    request.get(`${MYIP_ENDPOINT}/status`, (error, response, body) => {
      callback(error, response, body);
    });
  }

};
