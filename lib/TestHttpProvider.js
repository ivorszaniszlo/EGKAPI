var core = require('core');
var https = require('https');
var TestHttpProvider = function() {};
/**
 * cUrl Request
 * @param  {string} host
 * @param  {string} path
 */
TestHttpProvider.prototype.download = function(host, path) {
    var optionsget = {
        host : host,
        port : 443,
        method : 'GET',
        path: path,
        headers: {'Cache-Control': 'no-cache'}
    };
    console.info('Options prepared:');
    console.info(optionsget);
    console.info('Do the GET call');
    // do the GET request
    var reqGet = https.request(optionsget, function(res) {
        console.log("statusCode: ", res.statusCode);
        // uncomment it for header details
        // console.log("headers: ", res.headers);
        res.on('data', function(d) {
            console.info('GET result:\n\n');
            process.stdout.write(d);
            console.info('\n\nCall completed');
        });
        res.on('end', function(d) {
            
        });
    });
    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });
}

exports.TestHttpProvider = TestHttpProvider;