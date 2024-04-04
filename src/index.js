require("./configs/db/withoutTLS");

const path = require("path");
const fs = require("fs");
const { createVideo, getVideo } = require("./helpers/video");
const { updateLibrary, getLibrary } = require("./helpers/library");
const { getShelf, updateShelf } = require("./helpers/shelf");

const formatVideo = (video) => {
	return {
		title: video.title,
		guid: video.bunny_id,
		platform_data: {
			duration: video.duration,
			bunny_data: video.bunny_data,
			full_obj: video,
		},
		shelf: "660ba0f159e8c7e6d4386151",
		added_by: "65f157a0b9e15cda7c6a87fe",
		status: video.status,
		library: "65e7e126df8e9ac00a5010cc",
		createdAt: video.createdAt.$date,
	};
};

const migrateOstadRecording = async () => {
	try {
		console.log("start");
		let recordings = path.join(
			__dirname,
			"./data/ostad-v2-prod.recording.json"
		);

		recordings = fs.readFileSync(recordings, {
			encoding: "utf8",
		});

		recordings = JSON.parse(recordings);

		for (let i = 0; i < recordings.length; i++) {
			try {
				let video = recordings[i];

				video = formatVideo(video);

				const videoExist = await getVideo({ guid: video.guid });

				if (videoExist) {
					console.log("Video already exists");
					continue;
				}

				// clg

				const create = await createVideo(video);

				if (create) {
					const libraryExist = await getLibrary({ _id: video.library });

					const shelfExist = await getShelf({ _id: video.shelf });

					if (libraryExist) {
						const count = libraryExist.video_count + 1;
						const size =
							libraryExist.storage +
							video.platform_data.bunny_data.response_object.storageSize;

						const update = await updateLibrary(
							{
								_id: video.library,
							},
							{
								video_count: count,
								storage: size,
							}
						);

						if (update) {
							console.log(" updated library");
						} else {
							console.log("Library update failed");
						}
					}

					if (shelfExist) {
						const count = shelfExist.video_count + 1;
						const size =
							shelfExist.storage +
							video.platform_data.bunny_data.response_object.storageSize;

						const update = await updateShelf(
							{
								_id: video.shelf,
							},
							{
								video_count: count,
								storage: size,
							}
						);

						if (update) {
							console.log(" updated shelf");
						} else {
							console.log("Shelf update failed");
						}
					}
				} else {
					console.log("Video creation failed");
				}
			} catch (error) {
				console.log(error);
			}
		}
		console.log("end");
	} catch (error) {
		console.log(error);
	}
};

migrateOstadRecording();
