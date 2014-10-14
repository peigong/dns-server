var createConfig = require('server-helpers').createConfig;

function Config(dir){
    this.dir = dir;
    this.settings = {};
    this.dict = {
        'app': { 'file': 'settings.json' },
        'redis': { 'file': 'dao/redis.json' }
    };
    this.settings = this.getSettings('app');
}
Config.prototype.getSettings(key){
    var settings = null;
    if(!!this.dir && this.dict.hasOwnProperty(key)){
        if(!this.dict[key].hasOwnProperty('settings')){
            this.dict[key].handler = createConfig(this.dict[key].file);
            this.dict[key].handler.setConfigDir(this.dir);
            this.dict[key].settings = this.dict[key].handler.getConfig();
        }
        settings = this.dict[key].settings;
    }
    return settings;
};
module.exports = function(configDir){
    return new Config(configDir);
};
