var _ = require('lodash');
var blogcard = require('./lib/index');
var fb = {accessToken: process.env['FB_APP_TOKEN']};

blogcard(fb).fatch('https://www.youtube.com/?gl=JP&hl=ja', function(err, res) {
	if (err) return console.log(err);
	console.log(res);
});
