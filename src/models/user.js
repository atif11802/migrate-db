const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			default: null,
			index: true,
		},
		email: {
			type: String,
			default: null,
			index: true,
			trim: true,
		},
		phone: {
			type: String,
			// required: true,
			// unique: true,
			index: true,
		},
		custom_id: {
			type: String,
			default: null,
			index: true,
			trim: true,
		},
		avatar_url: {
			type: String,
			default: null,
		},
		is_super_admin: {
			type: Boolean,
			default: false,
			index: true,
		},
		role: {
			type: Number,
			default: 0,
			index: true,
		},
		api_key: {
			type: String,
			default: null,
			index: true,
			trim: true,
		},
		client_id: {
			type: String,
			default: null,
			index: true,
			trim: true,
		},
		client_key: {
			type: String,
			default: null,
			index: true,
			trim: true,
		},
		added_by: {
			type: Schema.Types.ObjectId,
			ref: "user",
			index: true,
		},
		webhook_url: {
			type: String,
			default: null,
		},
		is_service: {
			type: Boolean,
			default: false,
		},
	},
	{
		collection: "user",
		timestamps: true,
	}
);

const user = mongoose.model("user", userSchema);

module.exports = user;
