// const MODE = "prod";
const MODE = "dev";

module.exports = {
	AUTH_TOKEN_SECRET: "1234567890auth",
	REFRESH_TOKEN_SECRET: "1234567890refresh",
	DB:
		MODE === "prod"
			? "your_remote_db_address"
			: "mongodb://localhost:27017/mole-app",
};
