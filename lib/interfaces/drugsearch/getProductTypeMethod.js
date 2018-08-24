var jayson = require('jayson');
var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;
//Pharmindex unique hostname
const host ='https://ujapi.pharmindex.hu';
//get ProductType
const path ='helper/v1/product_type?cid=';
//Pharmindex unique client id
const cid ='FHBE7EBO2H0UB8GL';
//Pharmindex API Object
const productType = jayson.client.http(host + '/' + path + cid);
//get URL from Object
var url = productType.options.href;
//new method
var getProductTypeMethod = function(request, response, server) {
    JsonRpcMethod.call(this, request, response, server);
};
getProductTypeMethod.prototype = Object.create(JsonRpcMethod.prototype);
getProductTypeMethod.prototype.requiredParams = ['host', 'path', 'url'];
getProductTypeMethod.prototype.paramsConverter = function(params){

    var params = 
    {
        "host": host,
        "path": path,
        "url": productType.options.href
    };
    
    returnData = {};
    for(var i in params){
        if(i == 'host'){
            returnData[i] = params[i].replace("https://","").replace("http://","");
            if(returnData[i].slice(-1) == '/'){
                returnData[i] = returnData[i].slice(0,-1);
            }
        }
        else if(i=='path' && params[i][0]!='/'){
            returnData[i]='/'+params[i]+cid;
        }
        else if(i=='url' && params[i][0]!='/'){
            returnData[i]='/'+params[i];
        }
        else if(i=='data' && (typeof params[i]=="object")){
            console.log('data');
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

getProductTypeMethod.prototype.execute = function(params) {
    var params = 
    {
        "host": host,
        "path": path,
        "url": url
    };
    console.info('Executing getProductTypeMethod, HOST:', host,'PATH:', path + cid, 'URL:', url);
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
        this.server.httpProvider.download(params.host, params.path, params.url, function(err, res) {
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

getProductTypeMethod.prototype._dispatchOk = function(message) {
    var retEvent = new Event(JsonRpcMethod.Event.OK, message);
    this.dispatchEvent(retEvent);
};

getProductTypeMethod.prototype._dispatchError = function(params, errorCode, message) {
    var retEvent = new ErrorEvent(JsonRpcMethod.Event.ERROR, params, errorCode, message);
    this.dispatchEvent(retEvent);
};

exports.getProductTypeMethod = getProductTypeMethod;