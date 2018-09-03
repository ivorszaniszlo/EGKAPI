var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;
//set query string
const q = "?cid=";
//set Pharmindex unique client id
const cid ='FHBE7EBO2H0UB8GL';
/**
 * Product category (as disease group) query. Returns the main product categories and their subgroups (as disease subgroup)
 */
var getCategoryMethod = function(request, response, server) {
    JsonRpcMethod.call(this, request, response, server);
};
getCategoryMethod.prototype = Object.create(JsonRpcMethod.prototype);
getCategoryMethod.prototype.execute = function() {
    var that = this;
    //set Pharmindex unique hostname
    const host ='ujapi.pharmindex.hu';
    //set product path nam
    var pathname ='/classification/v1/product-category';
    var path = pathname + q + cid;
    var retUrl = host + path;
    this.server.HttpProvider.download(host, path, function(err, res) {
    //get here the HttpProvider statusCode
        try{
            if (!res) {
                that._dispatchError(params, -32602, 'Invalid params: Not found')
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

getCategoryMethod.prototype._dispatchOk = function(message) {
    var retEvent = new Event(JsonRpcMethod.Event.OK, message);
    this.dispatchEvent(retEvent);
};

getCategoryMethod.prototype._dispatchError = function(params, errorCode, message) {
    var retEvent = new ErrorEvent(JsonRpcMethod.Event.ERROR, params, errorCode, message);
    this.dispatchEvent(retEvent);
};

exports.getCategoryMethod = getCategoryMethod;