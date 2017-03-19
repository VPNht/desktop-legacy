import path from 'path';

module.exports = {

    resourceDir: function() {
        return process.env.BIN_PATH;
    },

    macsudo: function() {
        return path.join(this.resourceDir(), 'macsudo');
    }

};