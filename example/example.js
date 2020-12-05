var coinsbit = require("../index.js");

var api = coinsbit.publicApi();
api.getOrderBook("ETH_BTC").then(console.log);
api.getTicker("ETH_BTC").then(console.log);
api.getTrades("ETH_BTC", "10000").then(console.log);

var api2 = coinsbit.privateApi("api_key", "api_secret");
api2.getAssets().then(console.log);
api2.getAsset('BTC').then(console.log);
