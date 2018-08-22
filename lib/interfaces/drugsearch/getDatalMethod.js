var jayson = require('jayson');
var getData = require('./getDataFromUrlMethod');
var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;
//Pharmindex unique client id
var cid ='FHBE7EBO2H0UB8GL';
var productType = jayson.client.http('https://ujapi.pharmindex.hu/helper/v1/product_type?cid=' + cid);

console.log(getData);


