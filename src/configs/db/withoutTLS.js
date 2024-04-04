require("dotenv").config();
const mongoose = require("mongoose");

mongoose
	.connect(process.env.DB_URI, {
		dbName: process.env.DB_NAME,
	})
	.then(() => {
		console.log("MongoDB connected");
	})
	.catch((error) => {
		console.log("MongoDB connection error: ", error);
	});

mongoose.connection.on("connected", () => {
	console.log("Mongoose connected to db");
});

mongoose.connection.on("error", (error) => {
	console.log("Mongoose connection error: ", error);
});

mongoose.connection.on("disconnected", () => {
	console.log("Mongoose disconnected");
});

process.on("SIGINT", async () => {
	await mongoose.connection.close();
	process.exit(0);
});
