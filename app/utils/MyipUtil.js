import request from 'request';

import { dispatch } from '../store';
import { error, info } from '../actions/logActions';
import { translate } from './localizationUtil';
import { types } from '../actions/serverActions';

const MYIP_ENDPOINT = process.env.MYIP_ENDPOINT || 'https://myip.ht';

export default class MyipUtil {

  _servers() {
    return new Promise((resolve, reject) => {
      request.get(`${MYIP_ENDPOINT}/servers-geo.json`, (err, res, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(body);
        }
      });
    });
  }

  _getRemoteServers() {
    const options = [{
      value: 'hub.vpn.ht',
      label: translate('Nearest Server (Random)'),
      country: 'blank'
    }];

    return new Promise(resolve => {
      return this._servers().then(servers => {
        servers.map(server => {
          const loc = server.host.toUpperCase().replace(/^\D+/g, '');
          const dist = Math.round(server.distance);

          let serverName = `${server.countryName} - ${loc} (${dist} KM)`;
          if (server.regionName) serverName = `${server.regionName}, ${serverName}`;
          if (server.city) serverName = `${server.city}, ${serverName}`;

          return options.push({
            value: server.ip,
            label: serverName,
            distance: Math.round(server.distance),
            country: server.country
          });
        });

        return resolve(options);
      }).catch(err => dispatch(error(err)));
    });
  }

  fetch() {
    return this._getRemoteServers().then(servers => {
      dispatch(info(`MyipUtil.fetch - ${servers.length} servers`));
      // dispath({
      //   type: types.FETCH_SERVERS,
      //   payload: servers
      // });
    });
  }

  status(callback) {
    return request.get(`${MYIP_ENDPOINT}/status`, (err, res, body) => callback(err, res, body));
  }

}
