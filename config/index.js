// const MODE = "prod";
const MODE = "dev";

module.exports = {
	AUTH_TOKEN_SECRET: "1234567890auth",
	APOLLO_ENGINE_KEY: "1234567890qwertyuiop",
	REFRESH_TOKEN_SECRET: "1234567890refresh",
	DB:
		MODE === "prod"
			? "YOUR REMOTE DATABASE"
			: "mongodb://localhost:27017/mole-app",
};
