/**
 * API with Node Twitter module.
 *
 * Twitter client that displays tweets, friends, and direct messages. 
 * Post new tweets.
 * Handle app errors to user friendly error.
 *
 * @author Mahmoud Eid
*/

(function(){
	'use strict';

	var express = require('express'),
		twitter = require('./twitter'),
		bodyParser = require('body-parser');

	var app = express();

	/**
	 * Public files
	 */
	app.use('/static', express.static(__dirname + '/public'));

	/**
	 * Views
	 */
	app.set('view engine', 'pug');
	app.set('views', __dirname + '/templates');

	/** bodyParser.urlencoded(options)
	 * Parses the text as URL encoded data 
	 * (which is how browsers tend to send form data from regular forms set to POST)
	 */
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	/**
	 * Routes
	 */
	app.get('/', twitter.getFromTwitter);
	app.post('/', twitter.postTweet);

	/**
	 * Error handler.
	 */
	app.use(function(req, res, next) {
		var err = new Error('Page not found');
		err.status = 404;
		next(err);
	});

	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			err: err
		});
	});

	/**
	 * Server listen
	 */
	app.listen(3000, function() {
		console.log('The frontend server is running on port 3000!');
	});
})();