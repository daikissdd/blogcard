var _ = require('lodash');
var async = require('async');
var blogcard = require('./blogcard');
var Fbpage = require('./fbpage');
var createBaseUrl = require('./create-base-url');

module.exports = function(fb) {
	
	var fbpage = (_.has(fb, 'accessToken') && fb.accessToken) ? Fbpage(fb): null;
	
	return {
		fatch: function(url, callback) {
			blogcard(url, function(err, res) {
				if (err) return callback(err, null);
				
				if (_.isNull(fbpage)) return callback(err, res);
				
				fbpage(createBaseUrl(res.url), function(fbRes) {
					res.fb = fbRes;
					if (!res.icon.length && fbRes.picture.length) res.icon = fbRes.picture;
					return callback(err, res);
				});
			});
		}
	};

};

