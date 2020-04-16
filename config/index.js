// const MODE = "prod";
const MODE = "dev";

module.exports = {
	AUTH_TOKEN_SECRET: "1234567890auth",
	REFRESH_TOKEN_SECRET: "1234567890refresh",
	DB:
		MODE === "prod"
			? "YOUR REMOTE MONGO INSTANCE"
			: "mongodb://localhost:27017/mole-app",
};
