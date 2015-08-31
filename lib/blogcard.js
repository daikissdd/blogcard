var client = require('cheerio-httpcli');
var validator = require('validator');
var url = require('url');
var _ = require('lodash');
var async = require('async');
var fbpage = require('./fbpage');

var resFormat = function(getUrl) {
	var u = url.parse(getUrl);
	return {
		url: u.href,
		domain: u.hostname,
		domainInitial: u.hostname.charAt(0).toUpperCase(),
		title: '',
		description: '',
		ogImage: '',
		favicon: '',
		icon: '',
		fb: {},
		images: []
	}
};

var getMaxLongString = function(base, newStr) {
	var base = _.isUndefined(base) ? '': base;
	var newStr = _.isUndefined(newStr) ? '': newStr;
	return (base.length >= newStr.length) ? base: newStr;
};

module.exports = function(getUrl, callback) {

	if (!validator.isURL(getUrl)) return callback('Please require url params', null);
	
	var fatch = function(err, $, res) {
        if (err) return callback(err, null);
		
		var data = resFormat(getUrl);
		
		data.title = getMaxLongString($('title').text(), $('meta[property="og:title"]').attr('content'));
		data.description = getMaxLongString($('meta[name=description]').attr('content'), $('meta[property="og:description"]').attr('content'));
		
		var ogImage = $('meta[property="og:image"]').attr('content');		
		if (!_.isUndefined(ogImage)) data.ogImage = url.resolve(data.url, ogImage);
		
		$('link').each(function() {
			var rel = $(this).attr('rel');
			var href = $(this).attr('href');
			
			if (_.isUndefined(href)) return false;

			if (Number(rel.indexOf('shortcut')) !== -1) data.favicon = url.resolve(data.url, href);
			if (Number(rel.indexOf('apple-touch-icon')) !== -1) data.icon = url.resolve(data.url, href);
		});
		
		$('img').each(function() {
			var src = $(this).attr('src');
			if (_.isUndefined(src)) return false;
			data.images.push(url.resolve(data.url, src));
		});
		
		return callback(null, data);
	};
	
	client.fetch(getUrl, {}, fatch);
};
