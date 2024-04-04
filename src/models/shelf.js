const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shelfSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		library: {
			type: Schema.Types.ObjectId,
			ref: "library",
			required: true,
		},
		pr_shelf: {
			type: Schema.Types.ObjectId,
			ref: "shelf",
			default: null,
		},
		root_shelf: {
			type: Schema.Types.ObjectId,
			ref: "shelf",
			default: null,
		},
		storage: {
			type: Number,
			required: true,
			default: 0,
		},
		video_count: {
			type: Number,
			required: true,
			default: 0,
		},
		image: {
			type: String,
			default: null,
		},
	},
	{
		collection: "shelf",
		timestamps: true,
	}
);

const shelf = mongoose.model("shelf", shelfSchema);

module.exports = shelf;
