import _ from 'lodash';
import alt from '../alt';
import ServersActions from '../actions/ServersActions';
import request from 'axios';

const endpointURL = process.env.MYIP_ENDPOINT || 'https://myip.ht';

const ServersSource = {
  update: {
    async remote() {
      const { data } = await request( `${endpointURL}/servers-geo.json` );
      return data;
    },

    local( state ) {
      return null;
    },

    success: ServersActions.updateServers,
    error: ServersActions.updateServersError,

    shouldFetch( state ) {
      return true;
    }
  }
};

const DEFAULT_SERVER = {
    ip: 'hub.vpn.ht',
    name: 'Nearest Server (Random)',
    country: 'blank',
    distance: 0
};

class ServersStore {
    constructor() {
        this.state = {
            servers: [DEFAULT_SERVER]
        };

        this.registerAsync( ServersSource );
        this.bindAction( ServersActions.fetchServers, this.onFetchServers );
        this.bindAction( ServersActions.updateServers, this.onUpdateServers );
    }

    onFetchServers() {
        const instance = this.getInstance();

        if( instance.isLoading() === false ) {
            instance.update();
        }
    }

    onUpdateServers( {servers} ) {
        servers = servers.map( item => {
            const { countryName, country, regionName, cityName, distance, host, ip } = item;
            const region = regionName ? `${regionName}, ` : '';
            const city = cityName ? `${cityName}, ` : '';
            const name = `${region}${city}${countryName} - ${host.toUpperCase().replace( /^\D+/g, '' )} (${_.round(distance)}KM)`;
            return { name, country, ip };
        });

        servers.unshift( DEFAULT_SERVER );

        this.setState({ servers });
    }
}

export default alt.createStore( ServersStore, 'Servers' );