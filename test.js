const axios = require('axios');

axios.get('https://myip.ht/servers-geo.json')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
