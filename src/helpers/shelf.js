const mongoose = require("mongoose");
const { Shelf } = require("../models");

module.exports = {
	createShelf: async (body) => {
		try {
			const shelf = await Shelf(body).save();

			if (!shelf) throw new Error("Failed to create shelf");

			return shelf;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	},
	updateShelf: async (filter, body) => {
		try {
			const shelf = await Shelf.findOneAndUpdate(filter, body, {
				new: true,
			});

			if (!shelf) throw new Error("Failed to update shelf");

			return shelf;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	},

	getShelf: async (filter) => {
		try {
			const shelf = await Shelf.findOne(filter);

			if (!shelf) throw new Error("Failed to get shelf");

			return shelf;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	},

	deleteShelf: async (filter) => {
		try {
			const shelf = await Shelf.findOneAndDelete(filter);

			if (!shelf) throw new Error("Failed to delete shelf");

			return shelf;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	},
	findShelf: async (filter) => {
		try {
			const data = await Shelf.find(filter);

			if (!data) throw new Error("Failed to find shelf");

			return data;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	},

	listShelf: async ({
		offset,
		limit,
		library,
		currentPage,
		shelfs,
		name,
		show_permission,
		user,
	}) => {
		const filter = {
			$match: {},
		};

		if (library) {
			filter.$match.library = new mongoose.Types.ObjectId(library);
		}

		if (name) {
			filter.$match.name = {
				$regex: name,
				$options: "i",
			};
		}

		if (shelfs) {
			filter.$match._id = {
				$in: shelfs.map((shelf) => new mongoose.Types.ObjectId(shelf)),
			};
		}

		const aggregate = [
			filter,
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

		if (show_permission && user) {
			aggregate.splice(
				1,
				0,
				{
					$lookup: {
						from: "permission",
						let: {
							shelfId: "$_id",
							user: new mongoose.Types.ObjectId(user),
						},
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{ $eq: ["$shelf", "$$shelfId"] },
											{ $eq: ["$user", "$$user"] },
										],
									},
								},
							},
						],
						as: "permission",
					},
				},
				{
					$unwind: {
						path: "$permission",
						preserveNullAndEmptyArrays: true,
					},
				}
			);
		}
		try {
			let docs = await Shelf.aggregate(aggregate);

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
			console.error(error.message);
			return null;
		}
	},

	listShelfDto: {
		validKeys: [
			"page",
			"count",
			"currentPage",
			"name",
			"shelfId",
			"shelfs",
			"library",
			"show_permission",
			"user",
		],
	},
};
