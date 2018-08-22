var dl = require('dl'),
    core = require('core'),
    HttpProvider = require('./HttpProvider.js').HttpProvider,
    OpalServer = dl.opal.OpalServer,
    YAML = core.yaml.YAML;
var EGKApi = function(nosqldb) {
    OpalServer.apply(this, arguments);
    this.httpProvider = new HttpProvider();
    this._isStringParsableAsJson = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    };
};
EGKApi.prototype = Object.create(OpalServer.prototype);
exports.EGKApi = EGKApi;
