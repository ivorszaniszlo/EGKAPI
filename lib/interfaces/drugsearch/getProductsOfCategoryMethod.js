var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;
//set query string
const q = "?cid=";
//set Pharmindex unique client id
const cid ='FHBE7EBO2H0UB8GL';
/**
 * Disease groups query. Returns the major disease groups and their subgroups.
 *  @param {string} productCategoryId
 */
var getProductsOfCategoryMethod = function(request, response, server) {
    JsonRpcMethod.call(this, request, response, server);
};
getProductsOfCategoryMethod.prototype = Object.create(JsonRpcMethod.prototype);
// set productId
getProductsOfCategoryMethod.prototype.requiredParams = ['productId'];
getProductsOfCategoryMethod.prototype.execute = function(params) {
    console.info('Executing getDataMethod, params:', params);
        //set Pharmindex unique hostname
        const host ='ujapi.pharmindex.hu';
        //set product path name
        var pathname ='/classification/v1/product-category/';
        //set productCategoryId
        var productCategoryId = params.productCategoryId || false;
        var path = pathname + params.productCategoryId + '/products' + q + cid;
        var retUrl = host + path;
        var that = this;
        if (productCategoryId) {
            this.server.HttpProvider.download(host, path, function(err, res) {
               if (!res) {
                    that._dispatchError(err, 404, 'The parameter <productCategoryId> not found!');
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
                                'param': productCategoryId
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
            that._dispatchError(null, 502, 'The parameter <productCategoryId> is missing!');
        }
};

getProductsOfCategoryMethod.prototype._dispatchOk = function(message) {
    var retEvent = new Event(JsonRpcMethod.Event.OK, message);
    this.dispatchEvent(retEvent);
};

getProductsOfCategoryMethod.prototype._dispatchError = function(params, errorCode, message) {
    var retEvent = new ErrorEvent(JsonRpcMethod.Event.ERROR, params, errorCode, message);
    this.dispatchEvent(retEvent);
};

exports.getProductsOfCategoryMethod = getProductsOfCategoryMethod;