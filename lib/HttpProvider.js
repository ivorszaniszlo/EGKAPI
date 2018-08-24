var core = require('core');
//var http = require('http');

var http = require('follow-redirects').http;
var https = require('follow-redirects').https;

var HttpProvider = function() {};

HttpProvider.prototype.download = function(host, path, url, cb) {
    var options = {
        host: host,
        path: path,
        url: url,
        headers: {'Cache-Control': 'no-cache'}
    };
    var callback = function(response) {
        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });
        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {
            cb(null, str);
        });
    };
    var httpRequest = http.request(options, callback);
    httpRequest.on('error', function (err) {
        cb(err, null);
    });
    httpRequest.end();
};

exports.HttpProvider = HttpProvider;
