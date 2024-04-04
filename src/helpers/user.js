const { User } = require("../models");
const { addSecondsWithCurrentTime } = require("./utils");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports = {
	createUser: async (body) => {
		try {
			const data = new User(body);
			await data.save();

			return data;
		} catch (error) {
			console.log(error.message);
			return null;
		}
	},
	getUser: async (filter) => {
		try {
			const data = await User.findOne(filter).select(
				"-password -reset_password_link -email_verified -phone_verified"
			);

			return data;
		} catch (error) {
			console.log(error.message);
			return null;
		}
	},

	updateUser: async (filter, body) => {
		try {
			const data = await User.findOneAndUpdate(filter, body, { new: true });

			return data;
		} catch (error) {
			console.log(error.message);
			return null;
		}
	},

	deleteUser: async (filter) => {
		try {
			const data = await User.findOneAndDelete(filter);

			return data;
		} catch (error) {
			console.log(error.message);
			return null;
		}
	},

	listUser: async ({
		name,
		email,
		phone,
		role,
		offset,
		limit,
		currentPage,
		user_id,
		is_super_admin = false,
		_id,
	}) => {
		const filter = {
			$match: {
				is_super_admin: false,
			},
		};

		if (!is_super_admin) {
			filter.$match = {
				...filter.$match,
				added_by: new mongoose.Types.ObjectId(_id),
			};
		}
		if (name)
			filter.$match.name = {
				$regex: name,
				$options: "i",
			};
		if (email)
			filter.$match.email = {
				$regex: email,
				$options: "i",
			};
		if (phone)
			filter.$match.phone = {
				$regex: phone,
				$options: "i",
			};
		if (role) filter.$match.role = role;

		if (user_id) filter.$match._id = new mongoose.Types.ObjectId(user_id);

		const aggregate = [
			filter,
			{
				$project: {
					_id: 1,
					name: 1,
					email: 1,
					phone: 1,
					role: 1,
					createdAt: 1,
					updatedAt: 1,
				},
			},
			{
				$group: {
					_id: null,
					total: { $sum: 1 },
					results: { $push: "$$ROOT" },
				},
			},
			{
				$project: {
					_id: 0,
					total: 1,
					results: { $slice: ["$results", offset, limit] },
				},
			},
		];

		try {
			// console.log(JSON.stringify(aggregate, null, 2));
			let docs = await User.aggregate(aggregate);
			if (docs.length === 0) {
				return {
					results: [],
				};
			}

			docs = docs[0];
			const last_page = Math.ceil(docs.total / limit);
			return {
				first_page: currentPage === 1 ? null : 1,
				previous: currentPage === 1 ? null : currentPage - 1,
				next: offset + limit >= docs.total ? null : currentPage + 1,
				last_page: last_page === currentPage ? null : last_page,
				size: Array.isArray(docs.results) ? docs.results.length : null,
				...docs,
			};
		} catch (error) {
			console.log(error.message);
			return null;
		}
	},

	generateJwtToken: async (user, validityHours) => {
		const payload = user.is_bot
			? {
					_id: user._id.toString(),
					is_bot: true,
					name: user.name,
					is_active: user.is_active,
					acl_scopes: user.acl_scopes,
					s_id: user.s_id,
			  }
			: {
					_id: user._id.toString(),
					name: user.name,
					email: user.email,
					phone: user.phone,
					is_active: user.is_active,
					avatar_url: user.avatar_url ? user.avatar_url : null,
					role: 1,
					email_verified: user.email_verified,
					phone_verified: user.phone_verified,
					custom_id: user.custom_id,
			  };

		/**
		 * 60 * 60 (or, 3600 seconds) -> 60 minutes
		 */

		const settings = {};
		const expiresIn = validityHours
			? validityHours * 60 * 60
			: settings.customer_token_validity
			? settings.customer_token_validity * 3600
			: process.env.NODE_ENV === "test"
			? 60 * 60 * 24 * 30
			: 60 * 60;
		const accesstoken_exp = addSecondsWithCurrentTime(expiresIn, true);
		const accesstoken = jwt.sign(
			payload,
			user.is_bot ? process.env.JWT_SECRET_BOT : process.env.JWT_SECRET,
			{
				expiresIn,
				algorithm: "HS256",
			}
		);

		return { accesstoken, accesstoken_exp };
	},
	generateJwtTokenForAdmin: async (user) => {
		const payload = {
			_id: user._id.toString(),
			name: user.name,
			email: user.email,
			phone: user.phone,
			is_active: user.is_active,
			avatar_url: user.avatar_url ? user.avatar_url : null,
			role: user.role,
			is_super_admin: user.is_super_admin,
		};

		const settings = {};

		const expiresIn = settings.admin_token_validity
			? settings.admin_token_validity * 3600
			: process.env.NODE_ENV === "test"
			? 60 * 60 * 24 * 30
			: 60 * 60;
		const accesstoken_exp = addSecondsWithCurrentTime(expiresIn, true);
		const accesstoken = jwt.sign(payload, process.env.JWT_SECRET_ADMIN, {
			expiresIn,
			algorithm: "HS256",
		});

		return { accesstoken, accesstoken_exp };
	},

	listUserDto: {
		validateKeys: [
			"user_id",
			"name",
			"email",
			"phone",
			"role",
			"page",
			"count",
		],
	},
};
