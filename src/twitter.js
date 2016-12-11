/**
 * API with Node Twitter module.
 *
 * Twitter client that displays tweets, friends, and direct messages. 
 * post new tweets.
 *
 * @author Mahmoud Eid
*/

(function(){
	'use strict';
	var Twit = require('Twit'),
		config = require(__dirname+'/config.json');

	var twitter = new Twit(config);

	/** 
	 * Get data from twitter 
	 *
	 * Displays twitter data to Home page route. 
	 *
	 * @param {Object} req    - contains http request object
	 * @param (Object) res    - contains http response object
	 * @param {function} next - callback for error propogation
	 * @returns {Object} err  - express error object
	*/
	function getFromTwitter(req, res, next) {
		// User information
		twitter.get('users/show', {
			screen_name: config.screen_name
		},  
		function (err, data, response) {
			if(!err){
				var user = data;
				// User timeline
				twitter.get('statuses/user_timeline', { 
					screen_name: config.screen_name,
					count: 5
				},
				function (err, data, response) {
					if(!err){
						var recentPosts = data;
						// User friends
						twitter.get('friends/list', { 
							count: 5
						},  
						function (err, data, response) {
							if(!err){
								var friends = data;
								// User direct messages
								twitter.get('direct_messages/sent', { 
									count: 5
								},  
								function (err, data, response) {
									if(!err){
										var messages = data;
										res.render('index', {user: user, recentPosts: recentPosts, friends: friends, messages: messages});
									}else{
										err.message = 'Failed to get user direct messages.';
										return next(err);
									}
								});
							}else{
								err.message = 'Failed to get friends list';
								return next(err);
							}
						});
					}else{
						err.message = 'Failed to get tweets.';
						return next(err);
					}
				});
			}else{
				err.message = 'Failed to get user info.';
				return next(err);
			}
		});
	}

	/**
	 * Posts a tweet to twitter.
	 * @param {Object} req    - contains http request object
	 * @param (Object) res    - contains http response object
	 * @param {function} next - callback for error propogation
	 * @returns {Object} err  - express error object
	 */
	function postTweet(req, res, next) {
		twitter.post('statuses/update', { 
			status: req.body.tweet
		}, function(err, data, response) {
			if(!err){
				getFromTwitter(req, res);
			}else{
				return next(err);
			}
		});
	}

	exports.getFromTwitter = getFromTwitter;
	exports.postTweet = postTweet;
})();