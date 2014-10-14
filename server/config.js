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
Config.prototype.getSettings = function(key){
    var settings = null;
    if(!!this.dir){
        if(!this.dict.hasOwnProperty(key)){
            this.dict[key] = {};
        }
        if(!this.dict[key].hasOwnProperty('settings')){
            var filename = '';
            if(this.dict[key].hasOwnProperty('file')){
                filename = this.dict[key].file;
            }else if(this.settings.hasOwnProperty(key)){
                filename = this.settings[key];
                this.dict[key].file = filename;
            }
            this.dict[key].handler = createConfig(filename);
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
