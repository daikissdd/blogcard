var FB = require('fb');
var _ = require('lodash');

module.exports = function(fb) {
	var ops = _.extend({locale: 'ja_JP', fields: ['picture']}, fb.ops);
	FB.setAccessToken(fb.accessToken);
	var response = function(callback, appId) {
		return function(fbpageRes) {
			return callback(null, {
				picture: fbpageRes.picture.data.url,
				appId: appId
			});
		};
	};
	
	return {
		getByUrl: function(url, callback) {
			FB.api('/'+url, {}, function(res) {
				var pageId = _.has(res, 'og_object') ? res.og_object.id: null;
				if (!pageId) return callback('FB-ERROR', null);
				FB.api('/'+pageId, ops, response(callback, pageId));
			});
		},
		getById: function(pageId, callback) {
			FB.api('/'+pageId, ops, response(callback, pageId));
		}
	};
};