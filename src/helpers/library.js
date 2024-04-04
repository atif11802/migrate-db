const { Library } = require("../models");
const mongoose = require("mongoose");

module.exports = {
	createLibrary: async (body) => {
		try {
			const data = await Library(body).save();

			if (!data) throw new Error("Failed to create shelf");

			return data;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	},

	updateLibrary: async (filter, body) => {
		try {
			const data = await Library.findOneAndUpdate(filter, body, {
				new: true,
			});

			if (!data) throw new Error("Failed to update library");

			return data;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	},

	getLibrary: async (filter) => {
		try {
			const data = await Library.findOne(filter).populate("service");

			if (!data) throw new Error("Failed to get shelf");

			return data;
		} catch (error) {
			console.log(error.message);
			return null;
		}
	},

	deleteLibrary: async (filter) => {
		try {
			const data = await Library.findOneAndDelete(filter);

			if (!data) throw new Error("Failed to delete shelf");

			return data;
		} catch (error) {
			console.error(error.message);
			return null;
		}
	},

	listLibrary: async ({ offset, limit, currentPage, service, libraries }) => {
		const filter = {
			$match: {},
		};

		if (service) {
			filter.$match.service = new mongoose.Types.ObjectId(service);
		}

		if (libraries) {
			filter.$match._id = {
				$in: libraries.map((id) => new mongoose.Types.ObjectId(id)),
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

		try {
			let docs = await Library.aggregate(aggregate);

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

	listLibraryDto: {
		validKeys: [
			"page",
			"count",
			"currentPage",
			"service",
			"show_immediate_root",
			"libraries",
		],
	},
	createLibraryDto: {
		mustKeys: [
			"title",
			"bunny_api_key",
			"bunny_stream_library_id",
			"bunny_stream_base_url",
			"bunny_stream_pull_zone_url",
			"service",
		],
	},
};
