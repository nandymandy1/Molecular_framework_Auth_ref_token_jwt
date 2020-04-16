"use strict";

const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models");
const { authMiddleware } = require("../functions/auth");
const { issueToken, issueNewTokens } = require("../functions/auth");
const { loginValidate, registerValidate } = require("../validators/user");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "users",
	/**
	 * Settings
	 */
	settings: {
		graphql: {
			type: `	
                type User {
                    _id: ID!
                    name: String!
					email: String!
					username: String!
					user_type: String!
				}

				type Auth {
					user: User!
					message: String!
					authToken: String!
					refreshToken: String!
				}

				type Tokens {
					authToken: String!
					refreshToken: String!
				}
            `,
			resolvers: {},
		},
	},
	/**
	 * Dependencies
	 */
	dependencies: [],
	/**
	 * Actions
	 */
	actions: {
		// Rest API's
		register: {
			rest: {
				method: "POST",
				path: "/register",
			},
			async handler({ params }) {
				try {
					return await this.registerMethod(params);
				} catch (err) {
					return {
						err: err.message,
					};
				}
			},
		},

		login: {
			rest: {
				method: "POST",
				path: "/login",
			},
			params: {
				username: "string",
				password: "string",
			},
			async handler({ params }) {
				try {
					return await this.authenticateMethod(params);
				} catch (err) {
					return {
						err: err.message,
					};
				}
			},
		},

		refreshToken: {
			rest: {
				method: "GET",
				path: "/refresh-token",
			},
			handler: async (ctx) => {
				try {
					return await this.tokenService(ctx);
				} catch (err) {
					return {
						err: err.message,
					};
				}
			},
		},

		me: {
			rest: {
				method: "GET",
				path: "/me",
			},
			auth: "required",
			async handler({ meta }) {
				return await this.profileMethod(meta.user);
			},
		},

		// Graphql API's
		registerResolver: {
			graphql: {
				mutation: `registerUser(
					name: String!
					email: String!
					username: String!
					password: String!
					user_type: String!
				): Auth!`,
			},
			async handler({ params }) {
				return await this.registerMethod(params);
			},
		},

		authResolver: {
			graphql: {
				query: `loginUser(
					username: String!
					password: String!
				): Auth!`,
			},
			async handler({ params }) {
				return await this.authenticateMethod(params);
			},
		},

		profileResolver: {
			graphql: {
				query: "me:User!",
			},
			async handler(ctx) {
				let authUser = await this.getAuthUser(ctx);
				return await this.profileMethod(authUser);
			},
		},

		tokenResolver: {
			graphql: {
				query: "refreshTokens:Tokens!",
			},
			async handler(ctx) {
				return await this.tokenService(ctx);
			},
		},
	},
	/**
	 * Methods
	 */
	methods: {
		async registerMethod(creds) {
			try {
				await Joi.validate(creds, registerValidate, {
					abortEarly: false,
				});
				let newUser = new User({ ...creds });
				let result = await newUser.save();
				return await this.authRespHandler(result);
			} catch (err) {
				throw new Error(err.message);
			}
		},

		async authenticateMethod(creds) {
			try {
				await Joi.validate(creds, loginValidate, {
					abortEarly: false,
				});
				const { username, password } = creds;
				let user = await User.findOne({ username });
				if (!user) {
					throw new Error("Username not found");
				} else {
					let isMatch = await user.passwordCompare(password);
					if (!isMatch) {
						throw new Error("Incorrect password.");
					}
					return await this.authRespHandler(user);
				}
			} catch (err) {
				throw new Error(err.message);
			}
		},

		async authRespHandler(user) {
			let tokens = await issueToken(user);
			return {
				user: _.pick(user, [
					"_id",
					"name",
					"email",
					"username",
					"user_type",
				]),
				message: `Welcome ${user.name}`,
				...tokens,
			};
		},

		async profileMethod(user) {
			try {
				return {
					..._.pick(user, [
						"_id",
						"name",
						"email",
						"username",
						"user_type",
					]),
				};
			} catch (err) {
				throw new Error(err.message);
			}
		},

		async getAuthUser({ options }) {
			let authUser = await authMiddleware(
				options.parentCtx.params.req.headers["authorization"]
			);
			if (!authUser) {
				throw new Error("Unauthenticated");
			}
			return authUser;
		},

		async tokenService(ctx) {
			try {
				let refreshToken =
					ctx.options.parentCtx.params.req.headers["refreshtoken"];
				let tokens = await issueNewTokens(refreshToken);
				if (!tokens) {
					throw new Error("Invalid Refresh Token");
				}
				return tokens;
			} catch (err) {
				throw new Error(err.message);
			}
		},
	},
	/**
	 * Events
	 */
	events: {},
	/**
	 * Service created lifecycle event handler
	 */
	created() {},
	/**
	 * Service started lifecycle event handler
	 */
	async started() {},
	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
