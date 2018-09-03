// var http = require('http');
var http = require('follow-redirects').http;
/**
 * cUrl Request
 * @param  {String} host
 * @param  {String} path
 * @param {Function} callback 
 */
var HttpProvider = function() {};
HttpProvider.prototype.download = function(host, path, cb) {
    var options = {
        host: host,
        path: path,
        headers: {'Cache-Control': 'no-cache'
                 }
    };
    console.info('Options prepared:');
    console.info(options);
    console.info('Do the GET call');
      // do the GET request
    var callback = function(response) {
        var statusCode = response.statusCode;
        console.log("statusCode: ", statusCode);
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