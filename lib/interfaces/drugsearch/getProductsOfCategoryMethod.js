var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;
//set query string
const q = "?cid=";
//set Pharmindex unique client id
const cid ='FHBE7EBO2H0UB8GL';
/**
 * Disease groups query. Returns the major disease groups and their subgroups.
 * @param {String|null} {"productCategoryId": ""} required
 * @param {Enum|null} @options= "package"|"product" {"response_type": "package"}
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
        //set response type
        var response_type = params.response_type || false;
        //set productCategoryId
        var productCategoryId = params.productCategoryId || false;
        var path = pathname + params.productCategoryId + '/products' + q + cid;
        var retUrl = host + path;
        
        var getResponseType = function(){
            if(response_type) {
                path = path + '&response_type=' + response_type;
            }
            else {
                return path;
            }
        };

        getResponseType(); 

        var that = this;
        if (productCategoryId) {
            this.server.HttpProvider.download(host, path, function(err, res) {
                if (!res) {
                    that._dispatchError(params, -32000, 'Http error!');
                } else {
                    try {  
                    } catch (err) {
                    that._dispatchError(err, -32700, 'Parse error: invalid Json');
                    }
                    if (res.meta.statusCode === 204) {
                        that._dispatchError(err, -32602, 'Not found')
                    } else if (res.meta.statusCode === 200){
                        var data = JSON.parse(res.data);
                        var _result = {
                            'data': data,
                             meta: {
                                'url': retUrl,
                                'params': productCategoryId,
                                statusCode: 200,
                                 message: 'OK'
                                }
                            }
                        that._dispatchOk(_result);
                        }
                    that._dispatchOk(res);
                }
            });
            } 
        else {
            that._dispatchError(null, -32600, 'The parameter <productCategoryId> is missing!');
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