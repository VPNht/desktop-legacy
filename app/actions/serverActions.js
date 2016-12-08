import axios from 'axios';

import { onAppReady } from './accountActions';

export const types = {
  FETCH_SERVERS: 'FETCH_SERVERS',
  ERROR_SERVERS: 'ERROR_SERVERS',
  CHANGE_SERVER: 'CHANGE_SERVER'
};

export function fetchServers() {
  return function(dispatch) {
    return axios.get('https://myip.ht/servers-geo.json').then(res => {
        const servers = [{
          value: 'hub.vpn.ht',
          label: 'Nearest Server (Random)',
          country: 'blank'
        }];

        res.data.map(server => {
          const distance = Math.round(server.distance);
          const { ip, country } = server;

          const loc = server.host.toUpperCase().replace(/^\D+/g, '');
          let label = `${server.countryName} - ${distance} KM - LOC ${loc}`;

          if (server.regionName) label = `${server.regionName}, ${label}`;
          if (server.city) label = `${server.city}, ${label}`;

          return servers.push({
            country,
            distance,
            label,
            value: ip
          });
        });

        dispatch({
          type: types.FETCH_SERVERS,
          payload: servers
        });

        return dispatch(onAppReady());
      }).catch(err => dispatch({
        type: types.ERROR_SERVERS,
        payload: err
      }));
  };
}

export function changeServer(server) {
  return {
    type: types.CHANGE_SERVER,
    payload: server
  };
}
