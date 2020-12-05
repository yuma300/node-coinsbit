const rp = require('request-promise');
const crypto = require('crypto');
const querystring = require('querystring');
const qs = require('qs');

var CoinsbitPrivate = function(apiKey, apiSecret, { endPoint = "https://coinsbit.io", timeout = 5000, keepalive = false }) {
    this.endPoint = endPoint;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.timeout = timeout;
    this.keepalive = keepalive;
};

var privateApi =

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
    const date = new Date();
    const nonce = date.getTime();
    let data = Object.assign({
        'request': path,
        'nonce': nonce
    }, params);
    data = JSON.stringify(data);
    const payload = Buffer.from(data).toString('base64');
    signature = this.createSign('sha512', this.apiSecret, payload);

    const options = {
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
    const path = "/api/v1/account/balances";
    return this.postQuery(path);
};

CoinsbitPrivate.prototype.getAsset = function(asset) {
    const path = "/api/v1/account/balance";
    return this.postQuery(path, { 'currency': asset });
};

module.exports = function(apiKey, apiSecret, settings) {
    return new CoinsbitPrivate(apiKey, apiSecret, settings);
};
