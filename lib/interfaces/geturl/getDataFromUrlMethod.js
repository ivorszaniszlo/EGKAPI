var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;
/**
 * cURL Request for JSON RPC 
 * @param {String} host
 * @param {String} path 
 *
 */
var getDataFromUrlMethod = function(request, response, server) {
    JsonRpcMethod.call(this, request, response, server);
};
getDataFromUrlMethod.prototype = Object.create(JsonRpcMethod.prototype);
getDataFromUrlMethod.prototype.requiredParams = ['host', 'path'];
getDataFromUrlMethod.prototype.paramsConverter = function(params){
    returnData = {};
    for(var i in params){
        if(i == 'host'){
            returnData[i]=params[i].replace("https://", "").replace("http://", "");
            if(returnData[i].slice(-1) == '/'){
                returnData[i] = returnData[i].slice(0, -1);
            }
        }
        else if(i == 'path' && params[i][0] != '/'){
            returnData[i] = '/' + params[i];
        }
        else if(i =='data' && (typeof params[i] == "object")){
            var dataString = '?';
            var dataIndex = 0;
            for (var j in params[i]){
                dataString += (dataIndex == 0 ? "" : "&") + j + "=" + params[i][j];
                dataIndex ++;
            }
            returnData[i] = dataString;
        }
        else{
            returnData[i] = params[i];
        }
    }
    return returnData;
};

getDataFromUrlMethod.prototype.execute = function(params) {
    console.info('Executing getDataMethod, params:', params);
    var valid = false;
    for (var i in this.requiredParams){
        valid = (params.hasOwnProperty(this.requiredParams[i]) ? true : false);
    }

    var that = this;
    var params = this.paramsConverter(params);
    if(params.hasOwnProperty('data')){
        params.path+=params.data;
    }
    if(valid){
        this.server.HttpProvider.download(params.host, params.path, function(err, res) {
            //get here the HttpProvider statusCode
            var statusCode = res.meta.statusCode;
            if (err) {
                that._dispatchError(params, -32000, 'Http error!');
            } else {
                try{
                }
                catch(err){
                that._dispatchError(err, -32700, 'Parse error: invalid Json');
                }
                    if (statusCode === 204){
                        that._dispatchError(err, -32602, 'Not found')
                    } else if (statusCode === 200){ 
                        var data = JSON.parse(res.data);
                        var _result = {
                            'data': data,
                            meta: {
                                statusCode: 200,
                                message: 'OK'
                                }
                            }
                        that._dispatchOk(_result);
                        }
            }
        });
    }
    else{
        that._dispatchError(params, -32602, 'Invalid method parameters: <host> and <path> are required!');
    }
};

getDataFromUrlMethod.prototype._dispatchOk = function(message) {
    var retEvent = new Event(JsonRpcMethod.Event.OK, message);
    this.dispatchEvent(retEvent);
};

getDataFromUrlMethod.prototype._dispatchError = function(params, errorCode, message) {
    var retEvent = new ErrorEvent(JsonRpcMethod.Event.ERROR, params, errorCode, message);
    this.dispatchEvent(retEvent);
};

exports.getDataFromUrlMethod = getDataFromUrlMethod;