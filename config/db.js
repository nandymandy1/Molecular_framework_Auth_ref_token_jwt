const { connect } = require("mongoose");

// const DB = "mongodb://localhost:27017/mole-app";

const connectDB = async () => {
	try {
		await connect(DB, {
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MONGOOSE_DB_CONNECTION_SUCCESSFUL", `\n${DB}`);
	} catch (err) {
		console.log("MONGOOSE_DB_CONNECTION_ERROR", err.message);
	}
};

module.exports = connectDB;
