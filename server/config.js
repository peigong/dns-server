var path = require('path');
var configDir = path.resolve(__dirname, '..', '..', '..', 'config');

function getSettings(filename){
    return require(path.join(configDir, filename));
}

module.exports = {
    getSettings: getSettings
}