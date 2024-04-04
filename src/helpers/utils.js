const { createHash, randomBytes } = require("crypto");
const moment = require("moment");
const libphonenumberJs = require("libphonenumber-js");

module.exports = {
	validateRequest: (
		keys = [],
		validKeys = [],
		mustKeys = [],
		validateArray = []
	) => {
		try {
			if (!Array.isArray(keys)) throw new Error("keys must be array");
			if (!Array.isArray(validKeys)) throw new Error("validKeys must be array");
			if (!Array.isArray(mustKeys)) throw new Error("mustKeys must be array");

			if (!keys) throw new Error("keys is required");

			if (!validKeys) throw new Error("validKeys is required");

			if (!mustKeys) throw new Error("mustKeys is required");

			if (keys.length > validKeys.length + mustKeys.length) {
				throw Error("Unexpected key in body");
			}

			keys.forEach((key) => {
				if (!validKeys.includes(key) && !mustKeys.includes(key)) {
					throw Error(`Unexpected key: ${key} in body`);
				}
			});

			mustKeys.forEach((key) => {
				if (!keys.includes(key)) {
					throw Error(`Missing field: ${key}`);
				}
			});

			validateArray.forEach((validate) => {
				if (!validate.title) throw Error("validate is required");
				if (!validate.toBeChecked) throw Error("toBeChecked is required");

				if (!Array.isArray(validate.toBeChecked)) {
					throw Error(`${validate.title} must be array`);
				}
			});
		} catch (error) {
			console.log(error.message);
			throw error;
		}
	},
	generateSha256Hash: (str) => {
		return createHash("sha256").update(str).digest("hex");
	},
	addMinutesWithDateTime: (date, minutes) => {
		return moment(date).add(minutes, "minutes");
	},
	addSecondsWithCurrentTime: (seconds, convertToTimestamp = false) => {
		const result = moment().add(seconds, "seconds");
		return convertToTimestamp ? result.toDate().getTime() : result;
	},

	getFormattedPhone: (phoneNumber, countryCode = "BD") => {
		if (!phoneNumber) return null;
		if (
			!libphonenumberJs.isPossiblePhoneNumber(phoneNumber, countryCode) ||
			!libphonenumberJs.isValidPhoneNumber(phoneNumber, countryCode)
		) {
			return false;
		}
		const phoneNum = libphonenumberJs(phoneNumber, countryCode);
		if (phoneNum.number.length < 14 || phoneNum.number.length > 14)
			return false;
		let formatted = "" + phoneNum.number;
		formatted = countryCode === "BD" ? formatted.substring(1) : formatted;

		return formatted;
	},

	genrateApikey: (bits) => {
		return randomBytes(bits).toString("hex");
	},
};
