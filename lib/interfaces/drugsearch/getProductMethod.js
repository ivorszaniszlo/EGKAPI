var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;
//set query string
const q = "?cid=";
//set Pharmindex unique client id
const cid ='FHBE7EBO2H0UB8GL';
/**
 * Returns a product datasheet based on the unique PHARMINDEX ID (productId) parameter.
 * @param {(string|number)} productId
 */
var getProductMethod = function(request, response, server) {
    JsonRpcMethod.call(this, request, response, server);
};
getProductMethod.prototype = Object.create(JsonRpcMethod.prototype);
// set productId
getProductMethod.prototype.requiredParams = ['productId'];
getProductMethod.prototype.execute = function(params) {
    console.info('Executing getDataMethod, params:', params);
        //set Pharmindex unique hostname
        const host ='ujapi.pharmindex.hu';
        //set product path name
        var pathname ='/medic/v1/product/';
        //set productId
        var productId = params.productId || false;
        var path = pathname + params.productId + q + cid;
        var retUrl = host + path;
        var that = this;
        if (productId) {
            this.server.HttpProvider.download(host, path, function(err, res) {
               if (!res) {
                    that._dispatchError(err, 404, 'The parameter <productId> not found!');
                } 
                else {
                    var data= JSON.parse(res);
                    var _result = {
                        response: [
                            {
                                'data': data
                            },
                            {
                                'url': retUrl,
                                'param': productId
                            },
                            {
                                statusCode: 200,
                                message: 'OK'
                            },
                        ],
                    };
                    that._dispatchOk(_result);
                } 
            });
        } 
        else {
            that._dispatchError(null, 502, 'The parameter <productId> is missing!');
        }
};

getProductMethod.prototype._dispatchOk = function(message) {
    var retEvent = new Event(JsonRpcMethod.Event.OK, message);
    this.dispatchEvent(retEvent);
};

getProductMethod.prototype._dispatchError = function(params, errorCode, message) {
    var retEvent = new ErrorEvent(JsonRpcMethod.Event.ERROR, params, errorCode, message);
    this.dispatchEvent(retEvent);
};

exports.getProductMethod = getProductMethod;