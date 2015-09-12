var http = require('http');
var https = require('https');
var client = require('cheerio-httpcli');
var validator = require('validator');
var url = require('url');
var _ = require('lodash');
var async = require('async');
var createBaseUrl = require('./create-base-url');

var resFormat = function(getUrl) {
	var u = url.parse(getUrl);
	if ((Number(u.hostname.indexOf('www.')) !== -1)) u.hostname = _(u.hostname).split('.').rest().join('.');
	return {
		url: u.href,
		domain: u.hostname,
		domainInitial: u.hostname.charAt(0).toUpperCase(),
		title: '',
		description: '',
		cover: '',
		favicon: createBaseUrl(getUrl) + '/favicon.ico',
		icon: '',
		fbAppId: '',
		images: []
	};
};

var getMaxLongString = function(base, newStr) {
	base = _.isUndefined(base) ? '': base;
	newStr = _.isUndefined(newStr) ? '': newStr;
	return (base.length >= newStr.length) ? base: newStr;
};

module.exports = function(getUrl, callback) {
	if (!validator.isURL(getUrl)) return callback('Please require url params', null);
	
	client.fetch(getUrl, {}, function(err, $, res) {
        if (err) return callback(err, null);
		
		var data = resFormat(getUrl);
		
		data.title = getMaxLongString($('title').text(), $('meta[property="og:title"]').attr('content'));
		data.description = getMaxLongString(
			$('meta[name=description]').attr('content'),
			$('meta[property="og:description"]').attr('content')
		);
		
		var cover = $('meta[property="og:image"]').attr('content');		
		if (!_.isUndefined(cover)) data.cover = url.resolve(data.url, cover);
		
		var fbAppId = $('meta[property="fb:app_id"]').attr('content');
		if (!_.isUndefined(fbAppId)) data.fbAppId = fbAppId;
		
		$('link').each(function() {
			var rel = $(this).attr('rel');
			var href = $(this).attr('href');
			
			if (_.isUndefined(rel) || _.isUndefined(href)) return false;

			if (Number(rel.indexOf('shortcut')) !== -1) data.favicon = url.resolve(data.url, href);
			if (Number(rel.indexOf('apple-touch-icon')) !== -1) data.icon = url.resolve(data.url, href);
		});
		
		$('img').each(function() {
			var src = $(this).attr('src');
			if (_.isUndefined(src)) return false;
			data.images.push(url.resolve(data.url, src));
		});
		
		if (!data.cover.length) data.cover = _.first(data.images);
		
		var isImg = function(imgUrl, callback) {
			var check = function(res) {
				if (!Number(res.headers['content-length'])) return callback('NO_CONTENT', null);
				return callback(null, true);
			};
			var onError = function(e) { callback(e, null); };
			if (url.parse(imgUrl).protocol === 'https:') return https.get(imgUrl, check).on('error', onError);
			return http.get(imgUrl, check).on('error', onError);
		};
		
		var check = function(key, next) {
			if (!validator.isURL(data[key])) return next();
			isImg(data[key], function(err, result) {
				if (!result) data[key] = '';
				next();
			});
		};
		
		async.each(['icon', 'favicon', 'cover'], check, function() { return callback(null, data); });
	});
};
