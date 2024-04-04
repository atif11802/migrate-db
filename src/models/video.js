const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		guid: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		platform_data: {
			type: Object,
			default: null,
		},
		shelf: {
			type: Schema.Types.ObjectId,
			ref: "shelf",
			index: true,
		},
		added_by: {
			type: Schema.Types.ObjectId,
			ref: "user",
		},
		status: {
			type: String,
			enum: ["initiated", "uploading", "failed", "done"],
			default: "initiated",
			index: true,
		},
		library: {
			type: Schema.Types.ObjectId,
			ref: "library",
			index: true,
		},
	},
	{
		collection: "video",
		timestamps: true,
	}
);

const video = mongoose.model("video", videoSchema);

module.exports = video;
