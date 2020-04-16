"use strict";

const ApiGateway = require("moleculer-web");
const DB_CONNECTOR = require("../config/db");
const { authMiddleware } = require("../functions/auth");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway],
	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 3000,
		// Exposed IP
		ip: "0.0.0.0",
		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],
		routes: [
			{
				path: "/api",
				whitelist: ["**"],
				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],
				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: true,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: false,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,
				aliases: {},

				/**
				 * Before call hook. You can check the request.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				 **/
				// onBeforeCall(ctx, route, req, res) {
				// 	// Set request headers to context meta
				// 	ctx.meta.userAgent = req.headers["user-agent"];
				// },

				/**
				 * After call hook. You can modify the data.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				 */
				// onAfterCall(ctx, route, req, res, data) {
				// 	// Async function which return with Promise
				// 	// return doSomething(ctx, res, data);
				// },

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {},
				// Set CORS headers
				cors: true,
				// Parse body content
				bodyParsers: {
					json: {
						strict: false,
						limit: "400mb",
					},
					urlencoded: {
						extended: false,
						limit: "400mb",
					},
				},
				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				// Available values: "all", "restrict"
				mappingPolicy: "restricted",
				// Enable/disable logging
				logging: true,
			},
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,
		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",
			// Options to `server-static` module
			options: {},
		},
	},

	methods: {
		/**
		 *--> Authenticate the request. It check the `Authorization` token value in the request header.
		 *--> Check the token value & resolve the user by the token.
		 *--> The resolved user will be available in `ctx.meta.user`
		 *
		 *--> PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			if (req.$action.authentication === "required") {
				let authToken = req.headers["authorization"];
				if (authToken) {
					let authUser = await authMiddleware(authToken);
					if (!authUser) {
						throw new ApiGateway.Errors.UnAuthorizedError(
							"INVALID_TOKEN"
						);
					} else {
						// Returns the resolved user. It will be set to the `ctx.meta.user`
						return authUser;
					}
				} else {
					throw new ApiGateway.Errors.UnAuthorizedError("NO_TOKEN");
				}
			} else {
				return null;
			}
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param { Context } ctx
		 * @param { Object } route
		 * @param { IncomingRequest } req
		 * @returns { Promise }
		 */
		async authorize(ctx, route, req) {
			// // Get the authenticated user.
			// const user = ctx.meta.user;
			// // It check the `auth` property in action schema.
			// if (req.$action.auth == "required" && !user) {
			// 	throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS");
			// }
		},
	},
	async created() {
		await DB_CONNECTOR();
	},
};
