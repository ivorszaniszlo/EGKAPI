var JsonRpcMethod = require('core').jsonrpc.JsonRpcMethod;
var Event = require('core').event.Event;
var ErrorEvent = require('core').event.ErrorEvent;
//set query string to Pharmindex client id
const qClientId = "?cid=";
//set Pharmindex unique client id
const cid ='FHBE7EBO2H0UB8GL';
/**
 * Search by detailed filter criteria
 * @param {String|null} {"molecule_name": ""} required or
 * @param {String|null} {"q": ""} required
 * @param {Enum|null} @options= "package"|"product" {"response_type": "package"}
 * @param {Array|String|null} {"type_ids": 1,2} product type
 * @param {Enum|null} @options= "V"|"VN" {"presc": "VN"}
 * @param {Enum|null} @options= "out_pharma|preg|preg_rel" {"info_icon": "preg"}
 * @param {Int|null} {"price_from": 1000}
 * @param {Int|null} {"price_to": 10000}
 */
var fullTextSearchMethod = function(request, response, server) {
    JsonRpcMethod.call(this, request, response, server);
};
fullTextSearchMethod.prototype = Object.create(JsonRpcMethod.prototype);
fullTextSearchMethod.prototype.requiredParams = ['molecule_name', 'q', 'response_type', ['type_ids'], 'presc', 'info_icon', 'price_from', 'price_to'];
fullTextSearchMethod.prototype.execute = function(params) {
    console.info('Executing getDataMethod, params:', params);
        const host ='ujapi.pharmindex.hu'; 
        var pathname ='/medic/v1/search';
        var path = pathname + qClientId + cid;
        var that = this;
        var molecule_name = params.molecule_name || false;
        var medicine_name = params.q || false;
        var response_type = params.response_type || false;
        var productType = [params.type_ids] || false;
        var supply = params.presc || false;
        var extendedInfo = params.info_icon || false;
        var priceFrom = params.price_from || false;
        var priceTo = params.price_to || false;

        var getResponseType = function(){
            if(response_type) {
                path = path + '&response_type=' + response_type;
            }
            else {
                return path;
            }
        };
        getResponseType();

        var getProductType = function(){
            if(productType) {
                path = path + '&type_ids=' + productType;
            }
            else {
                return path;
            }
        };
        getProductType();

        var getSupplyType = function(){
            if(supply) {
                path = path + '&presc=' + supply;
            }
            else {
                return path;
            }
        };
        getSupplyType();

        var getExtendedInfo = function(){
            if(extendedInfo) {
                path = path + '&info_icon=' + extendedInfo;
            }
            else {
                return path;
            }
        };
        getExtendedInfo();

        var getPriceFrom = function(){
            if(priceFrom) {
                path = path + '&price_from=' + priceFrom;
            }
            else {
                return path;
            }
        };
        getPriceFrom();

        var getPriceTo = function(){
            if(priceTo) {
                path = path + '&price_to=' + priceTo;
            }
            else {
                return path;
            }
        };
        getPriceTo();

        var removeAccents = function(string){
            string = string.replace(/[,/"'~ˇ^˘°˛`˙´˝¨¸#&@<>{};>()*]/gi, '');
            var accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØŐòóôőõöøĎďDŽdžÈÉÊËèéêëðÇçČčÐÌÍÎÏìíîïÙÚÛÜŰùűúûüĽĹľĺÑŇňñŔŕŠšŤťŸÝÿýŽž';
            var accentsOut = "AAAAAAaaaaaasOOOOOOOOoooooooDdDZdzEEEEeeeeeCcCcDIIIIiiiiUUUUUuuuuuLLllNNnnRrSsTtYYyyZz";
            string = string.split('');
            var strLen = string.length;
            var i, x;
            for (i = 0; i < strLen; i++) {
                if ((x = accents.indexOf(string[i])) != -1) {
                    string[i] = accentsOut[x];
                }
            }
            return string.join('');
        }

        if(medicine_name || molecule_name){
            if (medicine_name && !molecule_name) {
                path = path + '&q=' + removeAccents(medicine_name);
            }
            else if (molecule_name && !medicine_name) {
                path = path+ '&molecule_name=' + removeAccents(molecule_name);
            }
            else if (molecule_name && medicine_name) {
                path = path + '&q=' + removeAccents(medicine_name) + '&molecule_name=' + removeAccents(molecule_name);
            }
            this.server.HttpProvider.download(host, path, function(err, res) {
                var retUrl = host + path;
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
                        var _result = {
                                    'data': data,
                                     meta: {
                                        'url': retUrl,
                                        'params': params,
                                        statusCode: 200,
                                         message: 'OK'
                                }
                            }
                        that._dispatchOk(_result);
                        }
                    that._dispatchOk(res);
                }
            })
        }
        else {
        that._dispatchError(params, -32602, 'Invalid method parameters: <q> or <molecule_name> is required!');
    }
};

fullTextSearchMethod.prototype._dispatchOk = function(message) {
    var retEvent = new Event(JsonRpcMethod.Event.OK, message);
    this.dispatchEvent(retEvent);
};

fullTextSearchMethod.prototype._dispatchError = function(params, errorCode, message) {
    var retEvent = new ErrorEvent(JsonRpcMethod.Event.ERROR, params, errorCode, message);
    this.dispatchEvent(retEvent);
};

exports.fullTextSearchMethod = fullTextSearchMethod;