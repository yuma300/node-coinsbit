var rp = require('request-promise');
var qs = require('qs');

var CoinsbitPublic = function() {
  this.endPoint = "https://coinsbit.io";
  this.timeout = 5000;
  this.keepalive = false;
};

CoinsbitPublic.prototype.query = function(option) {
  return rp({
      uri: option,
      method: "GET",
      timeout: this.timeout,
      forever: this.keepalive,
    })
    .then(function(res) {
      var json = JSON.parse(res);
      return json;
    })
    .catch(function(err) {
      console.log("Error: " + err);
      throw new Error(err.statusCode);
    });
};

CoinsbitPublic.prototype.getTicker = function(pair) {
  var q = qs.stringify({ market: pair}, {
    delimiter: '&'
  });
  var path = "/api/v1/public/ticker?" + q;
  return this.query(this.endPoint + path);
};

CoinsbitPublic.prototype.getOrderBook = function(pair) {
  var q = qs.stringify({ market: pair }, {
    delimiter: '&'
  });
  var path = "/api/v1/public/depth/result?" + q;
  return this.query(this.endPoint + path);
};

CoinsbitPublic.prototype.getTrades = function(pair, since) {
  var q = qs.stringify({ market: pair, since: since }, {
    delimiter: '&'
  });
  var path = "/api/v1/public/history/result?" + q;
  return this.query(this.endPoint + path);
};
