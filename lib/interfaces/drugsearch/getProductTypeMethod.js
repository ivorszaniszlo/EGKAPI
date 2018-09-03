var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;
//set query string
const q = "?cid=";
//set Pharmindex unique client id
const cid ='FHBE7EBO2H0UB8GL';
/**
 * Request product type list
 */
var getProductTypeMethod = function(request, response, server) {
    JsonRpcMethod.call(this, request, response, server);
};
getProductTypeMethod.prototype = Object.create(JsonRpcMethod.prototype);
getProductTypeMethod.prototype.execute = function() {
    var that = this;
    //set Pharmindex unique hostname
    const host ='ujapi.pharmindex.hu';
    //set product path name
    var pathname ='/helper/v1/product_type';
    var path = pathname + q + cid;
    var retUrl = host + path;
    this.server.HttpProvider.download(host, path, function(err, res) {
    //get here the HttpProvider statusCode
        try{
            if (!res) {
                that._dispatchError(err, -32602, 'Not found');
            } else {
                var data= JSON.parse(res);
                    var _result = {
                        response: [
                            {
                                'data': data
                            },
                            {
                                'url': retUrl,
                            },
                            {
                                statusCode: 200,
                                message: 'OK'
                            },
                        ],
                    };
                    that._dispatchOk(_result);
                } 
        }
        catch(err) 
                {
                    if (statusCode === 200){
                        that._dispatchError(err, -32700, 'Parse error: invalid Json');
                    } else if (statusCode === 204){ 
                            that._dispatchError(params, -32602, 'Invalid params: Not found');
                    }
                    else 
                    that._dispatchError(err, -32603, 'Internal error');
                }  
    });
};

getProductTypeMethod.prototype._dispatchOk = function(message) {
    var retEvent = new Event(JsonRpcMethod.Event.OK, message);
    this.dispatchEvent(retEvent);
};

getProductTypeMethod.prototype._dispatchError = function(params, errorCode, message) {
    var retEvent = new ErrorEvent(JsonRpcMethod.Event.ERROR, params, errorCode, message);
    this.dispatchEvent(retEvent);
};

exports.getProductTypeMethod = getProductTypeMethod;