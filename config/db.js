const { DB } = require("./index");
const { connect } = require("mongoose");

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
