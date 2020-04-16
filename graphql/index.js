const { ApolloService } = require("moleculer-apollo-server");
const { APOLLO_ENGINE_KEY } = require("../config");

module.exports = ApolloService({
	// Global GraphQL typeDefs
	// eslint-disable-next-line
	typeDefs: ``,
	// Global resolvers
	resolvers: {},
	// API Gateway route options
	routeOptions: {
		path: "/graphql",
		cors: true,
		mappingPolicy: "restrict",
	},
	serverOptions: {
		tracing: true,
		engine: {
			apiKey: APOLLO_ENGINE_KEY,
		},
	},
});
