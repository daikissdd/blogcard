var FB = require('fb');
var _ = require('lodash');

module.exports = function(fb) {
	var ops = _.extend({locale: 'ja_JP', fields: ['picture']}, fb.ops);
	FB.setAccessToken(fb.accessToken);
	
	return {
		getByUrl: function(url, callback) {
			var response = function(fbpageRes) { return callback(null, fbpageRes.picture.data.url); };
			FB.api('/'+url, {}, function(res) {
				var pageId = _.has(res, 'og_object') ? res.og_object.id: null;
				if (!pageId) return callback('FB-ERROR', null);
				FB.api('/'+pageId, ops, response);
			});
		},
		getById: function(pageId, callback) {
			var response = function(fbpageRes) { return callback(null, fbpageRes.picture.data.url); };
			FB.api('/'+pageId, ops, response);
		}
	};
};