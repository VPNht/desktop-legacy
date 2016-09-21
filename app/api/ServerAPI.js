
import request from 'request';

export default class ServerAPI {

  constructor() {
    this.request = request.defaults({
      baseUrl: 'https://myip.ht/'
    });
  }

  _handleRequest(err, res, body) {
    if (err) {
      return reject(err);
    } else if (!body || res.statusCode >= 400) {
      return reject(new Error(`No data found on uri: ${uri}, qs: ${qs}, statuscode: ${res.statusCode}`))
    } else {
      return resolve(body);
    }
  }

  _get(uri, qs) {
    return new Promise((resolve, reject) => {
      request.get({ uri, qs }, this._handleRequest);
    });
  }

  fetch() {
    const options = [{
      value: 'hub.vpn.ht',
      label: 'Nearest Server (Random)',
      country: 'blank'
    }];

    return this._get('servers-geo.json').then(res => {
        const servers = JSON.parse(servers);

        servers.map(server => {
          const distance = Math.round(server.distance);
          const { ip as value, country} = server;

          const label = `${server.countryName} - ${distance} KM - LOC ${server.host.toUpperCase().replace( /^\D+/g, '')}`;

          if (server.regionName) label = `${server.regionName}, ${label}`;
          if (server.city) label = `${server.city}, ${label}`;

          options.push({
            country,
            distance,
            label,
            value
          });
        });

        return options;
      });
  }

  status() {
    return this._get('status');
  }

}
