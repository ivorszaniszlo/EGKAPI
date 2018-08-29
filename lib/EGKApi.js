var dl = require('dl');
var core = require('core');
var OpalServer = dl.opal.OpalServer;
var HttpProvider = require('./HttpProvider.js').HttpProvider;
var TestHttpProvider = require('./TestHttpProvider.js').TestHttpProvider;
var EGKApi = function() {
    OpalServer.apply(this, arguments);
    this.HttpProvider = new HttpProvider();
    this.TestHttpProvider = new TestHttpProvider();
};
EGKApi.prototype = Object.create(OpalServer.prototype);
exports.EGKApi = EGKApi;