var blogcard = require('./lib/index');
var fb = {accessToken: process.env['FB_APP_TOKEN']};
//var url = 'https://golfes.jp';
//var url = 'http://jumpin.onl';
//var url = 'http://thebridge.jp/2015/08/dmm-make-selection';
//var url = 'https://www.linkedin.com/pub/fdsfa-fsdaf/4/b7a/4b1';
//var url = 'https://www.linkedin.com/favicon.ico';
//var url = 'http://www.shiobara-cc.com/';
//var url = 'https://www.youtube.com/watch?v=CiUkCilM17E&list=FLacYD9DQbJ3IYvz6zj0ONww';
//var url = 'http://4travel.jp/';
//var url = 'http://news.golfdigest.co.jp/';
var url = 'http://www.service-safari.com/posts/search?q=6832&category_id=90';

blogcard(fb).fetch(url, function(err, res) {
	if (err) return console.log(err);
	console.log(res);
});