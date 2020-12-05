const rp = require('request-promise');
const qs = require('qs');

const CoinsbitPublic = function({ endpoint = "https://coinsbit.io", timeout = 5000, keepalive = false }) {
    this.endPoint = endpoint;
    this.timeout = timeout;
    this.keepalive = keepalive;
};

const toJSON = (dataToParse) => {
    try {
        // let json = typeof dataToParse === 'string' ?  JSON.stringify(dataToParse) : dataToParse;
        // return json
        return JSON.stringify(dataToParse);
    } catch (error) {
        console.log(`JSON parse error`, error);
        return dataToParse;
    }
}

CoinsbitPublic.prototype.query = function(option) {
    return rp({
            uri: option,
            method: "GET",
            timeout: this.timeout,
            forever: this.keepalive,
        })
        .then(function(res) {
            var json = toJSON(res);
            return json;
        })
        .catch(function(err) {
            console.log("Error: " + err);
            throw new Error(err.statusCode);
        });
};

CoinsbitPublic.prototype.getTicker = function(pair) {
    const q = qs.stringify({ market: pair }, {
        delimiter: '&'
    });
    const path = `/api/v1/public/ticker?${q||''}`;
    return this.query(this.endPoint + path);
};

CoinsbitPublic.prototype.getOrderBook = function(pair) {
    const q = qs.stringify({ market: pair }, {
        delimiter: '&'
    });
    const path = `/api/v1/public/depth/result?${q||''}`;
    return this.query(this.endPoint + path);
};

CoinsbitPublic.prototype.getTrades = function(pair, since) {
    const q = qs.stringify({ market: pair, since: since }, {
        delimiter: '&'
    });
    const path = `/api/v1/public/history/result?${q||''}`;
    return this.query(this.endPoint + path);
};

module.exports = CoinsbitPublic;
