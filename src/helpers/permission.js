const { Permission } = require("../models");

const createPermission = async (body) => {
	try {
		const permission = new Permission(body);
		await permission.save();

		return permission;
	} catch (error) {
		console.error(error.message);
		return null;
	}
};

const getPermission = async (filter, projection) => {
	try {
		const data = await Permission.findOne(filter, projection).populate(
			"shelf",
			"name  video_count image"
		);

		if (!data) throw new Error("Failed to get permission");
		return data;
	} catch (error) {
		console.log(error.message);
		return null;
	}
};

const updatePermission = async (filter, body) => {
	try {
		const data = await Permission.findOneAndUpdate(filter, body, {
			new: true,
		});

		if (!data) throw new Error("Failed to update permission");

		return data;
	} catch (error) {
		console.log(error.message);
	}
};

const deletePermission = async (filter) => {
	try {
		const data = await Permission.findOneAndDelete(filter);

		if (!data) throw new Error("Failed to delete permission");

		return data;
	} catch (error) {
		console.log(error.message);
	}
};

const findPermission = async (filter, projection) => {
	try {
		const data = await Permission.find(filter, projection);

		if (!data) throw new Error("Failed to find permission");
		return data;
	} catch (error) {
		console.log(error.message);
		return null;
	}
};

const createPermissionDto = {
	mustKeys: ["user"],
	validateKeys: ["shelf", "library"],
};

const updatePermissionDto = {
	validateKeys: ["shelf", "permission"],
};

module.exports = {
	createPermission,
	getPermission,
	updatePermission,
	deletePermission,
	createPermissionDto,
	updatePermissionDto,
	findPermission,
};
