// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

module.exports = {
	// get a single user by either their id or their username
	async getSingleUser({ user = null, params }) {
		const foundUser = await User.findOne({
			$or: [
				{ _id: user ? user._id : params.id },
				{ username: user.username },
			],
		});

		if (!foundUser) {
			return null;
		}
		return foundUser;
	},
	// create a user, sign a token, and send it back (to client/src/components/SignUpForm.js)
	async createUser({ body }) {
		const user = await User.create(body);

		if (!user) {
			return null;
		}
		const token = signToken(user);
		return { token, user };
	},
	// login a user, sign a token, and send it back (to client/src/components/LoginForm.js)
	// {body} is destructured req.body
	async login({ body }) {
		const user = await User.findOne({
			$or: [{ username: body.username }, { email: body.email }],
		});
		if (!user) {
			return null;
		}

		const correctPw = await user.isCorrectPassword(body.password);

		if (!correctPw) {
			return null;
		}
		const token = signToken(user);
		return { token, user };
	},
	// save a book to a user's `savedBooks` field by adding it to the set (to prevent duplicates)
	// user comes from `req.user` created in the auth middleware function
	async saveBook({ user, body }, res) {
		try {
			const updatedUser = await User.findOneAndUpdate(
				{ _id: user._id },
				{ $addToSet: { savedBooks: body } },
				{ new: true, runValidators: true }
			);
			return updatedUser;
		} catch (err) {
			console.log(err);
			return null;
		}
	},
	// remove a book from `savedBooks`
	async deleteBook({ user, params }, res) {
		const updatedUser = await User.findOneAndUpdate(
			{ _id: user._id },
			{ $pull: { savedBooks: { bookId: params.bookId } } },
			{ new: true }
		);
		if (!updatedUser) {
			return null;
		}
		return updatedUser;
(async()=>{})()	},
};
