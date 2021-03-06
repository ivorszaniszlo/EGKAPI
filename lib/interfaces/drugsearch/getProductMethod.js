var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;
var yaml = require('js-yaml');
var fs   = require('fs');
//set query string
const q = "?cid=";
//set Pharmindex unique client id
const cid ='FHBE7EBO2H0UB8GL';
/**
 * Returns a product datasheet based on the unique PHARMINDEX ID (productId) parameter.
 * @param {(String|Number)} productId
 */
var getProductMethod = function(request, response, server) {
    JsonRpcMethod.call(this, request, response, server);
};
getProductMethod.prototype = Object.create(JsonRpcMethod.prototype);
// set productId
getProductMethod.prototype.requiredParams = ['productId'];
getProductMethod.prototype.execute = function(params) {
    console.info('Executing getDataMethod, params:', params);
    const host ='ujapi.pharmindex.hu';
    var pathname ='/medic/v1/product/';
    var productId = params.productId || false;
    var path = pathname + params.productId + q + cid;
    var retUrl = host + path;
    var that = this;
    if (productId) {
        this.server.HttpProvider.download(host, path, function(err, res) {
        //get here the HttpProvider statusCode
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
                try {
                    const doc = yaml.safeLoad(fs.readFileSync('app.yaml', 'utf8'));
                  } catch (e) {
                    console.log(e);
                }
                var _result = {
                    'data': data,
                     meta: {
                        'url': retUrl,
                        'params': params,
                        statusCode: 200,
                         message: 'OK',
                         'API': {
                            'API name': doc.appname,
                            'version': 'v. ' + doc.version,
                            'service': doc.servicename 
                        }
                    }
                }
                that._dispatchOk(_result);
                }
            that._dispatchOk(res);
        }
    });
    } 
    else {
        that._dispatchError(params, -32602, 'Invalid method parameter: <productId> is required!');
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