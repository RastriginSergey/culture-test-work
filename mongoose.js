const mongoose = require('mongoose');
const config = require('config');

const bdURL = config.get('bdURL');

mongoose.Promise = Promise;

mongoose.set('debug', true);

mongoose.connect(bdURL, {
    server: {
        socketOptions: {
            keepAlive: 1
        },
        poolSize: 5
    }
});

module.exports = mongoose;