module.exports = {
	name: "greeter",
	actions: {
		hello: {
			graphql: {
				query: "hello: String",
			},
			handler(ctx) {
				return "Hello Moleculer!";
			},
		},
		welcome: {
			params: {
				name: "string",
			},
			graphql: {
				mutation: "welcome(name: String!): String",
			},
			handler(ctx) {
				return `Hello ${ctx.params.name}`;
			},
		},
	},
};
