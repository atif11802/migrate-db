const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const permissionSchema = new Schema(
	{
		shelf: {
			type: Schema.Types.ObjectId,
			ref: "shelf",
		},
		library: {
			type: Schema.Types.ObjectId,
			ref: "library",
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
			index: true,
		},
	},
	{
		collection: "permission",
		timestamps: true,
	}
);

const permission = mongoose.model("permission", permissionSchema);

module.exports = permission;
