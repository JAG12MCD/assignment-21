const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
	// function for our authenticated routes
	authMiddleware: function (req) {
		// allows token to be sent via  req.query or headers
		let token = req.query.token || req.headers.authorization;
		// ["Bearer", "<tokenvalue>"]
		if (req.headers.authorization) {
			token = token.split(' ').pop().trim();
		}

		// if no token, return the request object as is
		if (!token) {
			return req;
		}


		// if there's a token, try to decode it
		try {
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch {
			console.log('Invalid token');
		}

		return req.user;
	},
	signToken: function ({ username, email, _id }) {
		const payload = { username, email, _id };

		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};
