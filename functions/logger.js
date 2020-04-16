const { createLogger, transports, format } = require("winston");

const logger = createLogger({
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
		format.printf(
			(info) => `${info.timestamp} ${info.level}: ${info.message}`
		)
	),

	transports: [
		new transports.File({
			json: false,
			maxFiles: 5,
			maxsize: 5242880,
			filename: "./logs/all-logs.log",
		}),
	],
});

const errlogger = createLogger({
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
		format.printf(
			(info) => `${info.timestamp} ${info.level}: ${info.message}`
		)
	),

	transports: [
		new transports.File({
			json: false,
			maxFiles: 5,
			maxsize: 5242880,
			filename: "./logs/error.log",
		}),
	],
});

module.exports = { logger, errlogger };
