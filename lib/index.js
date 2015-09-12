var _ = require('lodash');
var async = require('async');
var blogcard = require('./blogcard');
var Fbpage = require('./fbpage');
var createBaseUrl = require('./create-base-url');

module.exports = function(fb) {
	
	var fbpage = (_.has(fb, 'accessToken') && fb.accessToken) ? Fbpage(fb): null;
	
	return {
		fetch: function(url, callback) {
			blogcard(url, function(err, res) {
				if (err) return callback(err, null);
				if (_.isNull(fbpage)) return callback(err, res);

				var fbpageGet = function(err, fb) {
					if (!res.icon.length && !!fb.picture.length) res.icon = fb.picture;
					if (fb.appId) res.fbAppId = fb.appId;
					return callback(err, res);
				};
				
				if (res.fbAppId) fbpage.getById(res.fbAppId, fbpageGet);
				else fbpage.getByUrl(createBaseUrl(res.url), fbpageGet);
			});
		}
	};

};

