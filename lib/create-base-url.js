var url = require('url');

module.exports = function(getUrl) {
	var u = url.parse(getUrl);
	return u.protocol + '//' + u.host;
};