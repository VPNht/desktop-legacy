import _ from 'lodash';
import alt from '../alt';
import ServerActions from '../actions/ServerActions';
import request from 'axios';

const endpointURL = process.env.MYIP_ENDPOINT || 'https://myip.ht';

const SearchSource = {
  update: {
    async remote( state ) {
      const { data } = await request( `${endpointURL}/servers-geo.json` );
      return data;
    },

    local( state ) {
      return null;
    },

    success: ServerActions.update,
    error: ServerActions.abort,

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

class ServerStore {
    constructor() {
        this.state = {
            servers: [DEFAULT_SERVER]
        };

        this.registerAsync( SearchSource );
        this.bindAction( ServerActions.fetch, this.onFetch );
        this.bindAction( ServerActions.update, this.onUpdate );
        this.bindAction( ServerActions.abort, this.onAbort );
    }

    onFetch( {servers} ) {
        const instance = this.getInstance();

        if( instance.isLoading() === false ) {
            instance.update();
        }
    }

    onUpdate( {servers} ) {
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

    onAbort() {
    }
}

export default alt.createStore( ServerStore, 'Servers' );