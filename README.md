blogcard.js
---

```install
npm i blogcard -S
```

### use

```js
var blogcard = require('blogcard');
var fb = {accessToken: process.env['FB_APP_TOKEN']};
var url = 'http://jumpin.onl';

blogcard(fb).fetch(url, function(err, res) {
	if (err) return console.log(err);
	console.log(res);
});
```
