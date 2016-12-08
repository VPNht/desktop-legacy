import request from 'request';

export default class ServerAPI {

  constructor() {
    this._request = request.defaults({
      baseUrl: 'https://myip.ht/'
    });
  }

  _get(uri, qs) {
    return new Promise((resolve, reject) => {
      return this._request.get({ uri, qs }, (err, res, body) => {
        if (err) {
          return reject(err);
        } else if (!body || res.statusCode >= 400) {
          const statuscode = res.statusCode;
          const msg = `No data found on uri: ${uri}, qs: ${qs}, statuscode: ${statuscode}`;
          const error = new Error(msg);
          return reject(error);
        }

        return resolve(body);
      });
    });
  }

  fetch() {
    const options = [{
      value: 'hub.vpn.ht',
      label: 'Nearest Server (Random)',
      country: 'blank'
    }];

    return this._get('servers-geo.json').then(() => {
      const servers = JSON.parse(servers);

      servers.map(server => {
        const distance = Math.round(server.distance);
        const country = server.country;
        const value = server.ip;

        const loc = server.host.toUpperCase().replace(/^\D+/g, '');
        let label = `${server.countryName} - ${distance} KM - LOC ${loc}`;

        if (server.regionName) label = `${server.regionName}, ${label}`;
        if (server.city) label = `${server.city}, ${label}`;

        return options.push({
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
