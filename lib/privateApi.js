var rp = require('request-promise');
var crypto = require('crypto');
var querystring = require('querystring');
var qs = require('qs');

var CoinsbitPrivate = function(apiKey, apiSecret) {
  this.endPoint = "https://coinsbit.io";
  this.apiKey = apiKey;
  this.apiSecret = apiSecret;
  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(apiKey, apiSecret) {
  return new CoinsbitPrivate(apiKey, apiSecret);
};

CoinsbitPrivate.prototype.query = function(options) {
  return rp(options).then(function(json) {
    return json
  }).catch(function(err) {
    console.log(err);
    throw new Error(err.statusCode);
  });
};

CoinsbitPrivate.prototype.createSign = function(argo, key, qstring) {
    return crypto.createHmac(argo, key).
        update(new Buffer(qstring)).
        digest('hex').toString();
};

CoinsbitPrivate.prototype.postQuery = function(path, params = []) {
  var date = new Date();
  var nonce = date.getTime();
  var data = Object.assign({
    'request': path,
    'nonce': nonce
  }, params);
  data = JSON.stringify(data);
  const payload = Buffer.from(data).toString('base64');
  signature = this.createSign('sha512', this.apiSecret, payload);

  var options = {
    method: "POST",
    uri: this.endPoint + path,
    headers: {
        'Content-type': 'application/json',
        'X-TXC-APIKEY': this.apiKey,
        'X-TXC-PAYLOAD': payload,
        'X-TXC-SIGNATURE': signature
    },
    body: data,
    json: false
  };
  return this.query(options);
};

CoinsbitPrivate.prototype.getAssets = function() {
  var path = "/api/v1/account/balances";
  return this.postQuery(path);
};

CoinsbitPrivate.prototype.getAsset = function(asset) {
  var path = "/api/v1/account/balance";
  return this.postQuery(path, {'currency': asset});
};
