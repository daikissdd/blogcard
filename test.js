var _ = require('lodash');
var blogcard = require('./lib/index');
var fb = {accessToken: '1584239041829787|RBKCLOT7O5nE2U4wtJ2tnZTg90o'};

blogcard(fb).fatch('http://www.yahoo.co.jp/', function(err, res) {
	if (err) return console.log(err);
	console.log(res);
});
