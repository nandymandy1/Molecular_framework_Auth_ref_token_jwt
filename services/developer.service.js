"use strict";
const fs = require("fs");
const path = require("path");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "developer",
	/**
	 * Settings
	 */
	settings: {},
	/**
	 * Dependencies
	 */
	dependencies: [],
	/**
	 * Actions
	 */
	actions: {
		infoLogs: {
			rest: {
				method: "GET",
				path: "/info-logs",
			},
			handler: async (ctx) => {
				let token =
					ctx.options.parentCtx.params.req.headers["auth_token"];
				console.log("TOKEN", token);
				const filePath = path.join(__dirname, "../logs/all-logs.log");
				return await fs.readFileSync(filePath, "utf8");
			},
		},
		errLogs: {
			rest: {
				method: "GET",
				path: "/err-logs",
			},
			handler: async (ctx) => {
				let token =
					ctx.options.parentCtx.params.req.headers["auth_token"];
				console.log("TOKEN", token);
				const filePath = path.join(__dirname, "../logs/error.log");
				return await fs.readFileSync(filePath, "utf8");
			},
		},
	},
	/**
	 * Events
	 */
	events: {},
	/**
	 * Methods
	 */
	methods: {},
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
