var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;

var https = require('https');

var subscribeMethod = function(request, response, server) {
    JsonRpcMethod.call(this, request, response, server);
};

/*
https://app.sendgrid.com/
rashu
v4r0sm4j0r111
list_id = '4219657' //deves
*/

subscribeMethod.prototype.requiredParams = ['email'];
subscribeMethod.prototype = Object.create(JsonRpcMethod.prototype);
subscribeMethod.prototype.execute = function(params) {

    if(this.checkParams(params)){
        this.createRecipient(params);
    }else{

        var statusCode = 206;
        var result = {
            'data': params,
            statusCode: statusCode,
            message: 'error'
        };
        this.dispatchError(result, statusCode, "need email, list_id parameters");
    }
};

subscribeMethod.prototype.checkParams = function(params){

    if (
        typeof params.list_id === 'undefined'
        || typeof params.email === 'undefined') {
        return false;
    }else{
        return true;
    }

}

subscribeMethod.prototype.addRecipientToList = function(recipient,params){

    var self = this;
    var list_id = params.list_id;

    var url = "https://api.sendgrid.com/v3/contactdb/lists/"+list_id+"/recipients/"+recipient;


    this.HttpsPost(url,
        null,
        function(res){
            res.setEncoding('utf8');
            if(res.statusCode == 201){

                var result = {
                    'data': params,
                    statusCode: 200,
                    message: 'OK'
                };

                self.dispatchOk(result);
            }else{

                self.dispatchError(null, res.statusCode, "Váratlan hiba");
            }
        });
}


subscribeMethod.prototype.createRecipient = function(params){
    var self = this;
    var body =[{
        "email": params.email,
    }];


    this.HttpsPost('https://api.sendgrid.com/v3/contactdb/recipients',
        body,
        function(res){
            res.setEncoding('utf8');

            res.on('data', function(chunk ) {
                // chunk = JSON.parse(chunk);
                chunk = JSON.parse(chunk);
                if (typeof chunk.errors !== 'undefined' &&
                    chunk.errors.length !== 0
                ) {
                    self.dispatchError(chunk, 500, chunk.errors[0].message);
                }else{

                    recipient = chunk.persisted_recipients[0];
                    self.addRecipientToList(recipient,params);
                }
            });
        });
}


subscribeMethod.prototype.HttpsPost = function(options,data,callback){
    var self = this;

    if (typeof(callback) != 'function') {
        callback = function() {};
    }

    if (typeof(options) == 'string') {
        var options = require('url').parse(options);
    }

    var data = JSON.stringify(data);
    var length = data.length;
    var api_key = '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';

    options.method = 'POST';
    options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': length,
        'Accept': "application/json",
        'Authorization': 'Bearer '+ api_key
    };

    var req = require('https').request(options, function(res) {
        callback(res);
    });

    req.write(data);
    req.end();

    return req;
}

subscribeMethod.prototype.dispatchOk = function(message) {
    console.log("dispatchOk is volt");
    var retEvent = new Event(JsonRpcMethod.Event.OK, message);
    this.dispatchEvent(retEvent);
};

subscribeMethod.prototype.dispatchError = function(params, errorCode, message) {
    var retEvent = new ErrorEvent(JsonRpcMethod.Event.ERROR, params, errorCode, message);
    this.dispatchEvent(retEvent);
};

exports.subscribeMethod = subscribeMethod;

