var FB = require('fb');
var _ = require('lodash');

module.exports = function(fb) {
	var fields = [
		'id',
		'picture',
		'likes'
	];
	var ops = _.extend({locale: 'ja_JP', fields: fields}, fb.ops);
	FB.setAccessToken(fb.accessToken);
	
	return {
		getByUrl: function(url, callback) {
			FB.api('/'+url, {}, function(res) {
				var pageId = _.has(res, 'og_object') ? res.og_object.id: null;
				if (!pageId) return callback('FB-ERROR', null);
				FB.api('/'+pageId, ops, function(fbpageRes) {
					var data = res.og_object;
					data.picture = fbpageRes.picture.data.url;
					return callback(null, data);
				});
			});
		},
		getById: function(pageId, callback) {
			FB.api('/'+pageId, ops, function(fbpageRes) {
				var data = res.og_object;
				data.picture = fbpageRes.picture.data.url;
				return callback(null, data);
			});
		}
	};
};