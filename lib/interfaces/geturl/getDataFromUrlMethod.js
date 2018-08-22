var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod,
Event = require('core').event.Event,
ErrorEvent = require('core').event.ErrorEvent;

var getDataFromUrlMethod = function(request, response, server) {
    JsonRpcMethod.call(this, request, response, server);
};

getDataFromUrlMethod.prototype = Object.create(JsonRpcMethod.prototype);

getDataFromUrlMethod.prototype.requiredParams = ['host','path'];

getDataFromUrlMethod.prototype.paramsConverter = function(params){
    returnData = {};
    for(var i in params){
        console.log(i);
        if(i=='host'){
            returnData[i]=params[i].replace("https://","").replace("http://","");
            if(returnData[i].slice(-1)=='/'){
                returnData[i]=returnData[i].slice(0,-1);
            }
        }
        else if(i=='path' && params[i][0]!='/'){
            returnData[i]='/'+params[i];
        }
        else if(i=='data' && (typeof params[i]=="object")){
            var dataString = '?';
            var dataIndex = 0;
            for (var j in params[i]){
                dataString+=(dataIndex==0 ? "" : "&") + j + "=" + params[i][j];
                dataIndex++;
            }
            returnData[i]=dataString;
        }
        else{
            returnData[i]=params[i];
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

    params = this.paramsConverter(params);

    if(params.hasOwnProperty('data')){
        params.path+=params.data;
    }

    if(valid){
        this.server.httpProvider.download(params.host, params.path, function(err, res) {
            if (err) {
                that._dispatchError(params, -31993, 'Http error!');
            } else {
                try{
                    var obj = JSON.parse(res);
                    that._dispatchOk(obj);
                }
                catch(e){
                    that._dispatchError(params, -31993, 'Invalid Json');
                }
            }
        });
    }
    else{
        that._dispatchError(params, -31991, 'Parameters doesn\'t match the requirements');
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
