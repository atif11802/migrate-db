const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarySchema = new Schema(
	{
		title: {
			type: String,
			required: true,
			unqiue: true,
			index: true,
		},
		storage: {
			type: Number,
			default: 0,
		},
		video_count: {
			type: Number,
			default: 0,
		},
		bunny_api_key: {
			type: String,
			required: true,
		},
		bunny_stream_library_id: {
			type: String,
			required: true,
		},
		bunny_stream_base_url: {
			type: String,
			required: true,
		},
		bunny_stream_pull_zone_url: {
			type: String,
			required: true,
		},
		service: {
			type: Schema.Types.ObjectId,
			ref: "user",
			index: true,
		},
	},
	{
		collection: "library",
		timestamps: true,
	}
);

const library = mongoose.model("library", librarySchema);

module.exports = library;
