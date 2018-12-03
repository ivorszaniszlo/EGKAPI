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