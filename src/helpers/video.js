const { Video } = require("../models");
const mongoose = require("mongoose");

module.exports = {
	createVideo: async (body) => {
		try {
			const data = await Video.create(body);

			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	},

	updateVideo: async (filter, body) => {
		try {
			const data = await Video.findOneAndUpdate(filter, body, { new: true });

			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	},

	getVideo: async (filter) => {
		try {
			const data = await Video.findOne(filter);

			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	},

	deleteVideo: async (filter) => {
		try {
			const data = await Video.findOneAndDelete(filter);

			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	},

	findListVideo: async (filter) => {
		try {
			const data = await Video.find(filter);

			return data;
		} catch (error) {
			console.log(error);
			return null;
		}
	},

	listVideo: async ({
		title,
		offset,
		limit,
		currentPage,
		shelf,
		library,
		status,
	}) => {
		const filter = {
			$match: {},
		};

		if (title) {
			filter.$match.title = {
				$regex: title,
				$options: "i",
			};
		}

		if (shelf) {
			filter.$match.shelf = new mongoose.Types.ObjectId(shelf);
		}

		if (library) {
			filter.$match.library = new mongoose.Types.ObjectId(library);
		}

		if (status) {
			filter.$match.status = status;
		}

		const aggregate = [
			filter,
			{
				$sort: { createdAt: -1 },
			},
			{
				$lookup: {
					from: "library",
					localField: "library",
					foreignField: "_id",
					as: "library",
				},
			},
			{
				$unwind: {
					path: "$library",
					preserveNullAndEmptyArrays: true,
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
			let docs = await Video.aggregate(aggregate);
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
			console.log(error);
			return null;
		}
	},

	createVideoDto: {
		mustKeys: ["shelfId"],
		validKeys: ["platform"],
	},

	listVideoDto: {
		validateKeys: ["title", "page", "count", "shelf", "status", "library"],
	},
};
