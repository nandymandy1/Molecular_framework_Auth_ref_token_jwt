"use strict";

const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models");
const { loginValidate, registerValidate } = require("../validators/user");
const { issueToken, issueNewTokens } = require("../functions/auth");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "users",
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
		register: {
			rest: {
				method: "POST",
				path: "/register",
			},
			params: {
				name: "string",
			},
			handler: async ({ params }) => {
				try {
					await Joi.validate(params, registerValidate, {
						abortEarly: false,
					});
					let newUser = new User({ ...params });
					let result = await newUser.save();
					let tokens = await issueToken(result);
					return {
						user: _.pick(result, [
							"_id",
							"name",
							"email",
							"username",
							"user_type",
						]),
						message: `Welcome ${params.name}`,
						...tokens,
					};
				} catch (err) {
					// Implement the logger function here
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
			handler: async ({ params }) => {
				try {
					await Joi.validate(params, loginValidate, {
						abortEarly: false,
					});
					const { username, password } = params;
					let user = await User.findOne({ username });
					if (!user) {
						throw new Error("Username not found");
					} else {
						let isMatch = await user.passwordCompare(password);
						if (!isMatch) {
							throw new Error("Incorrect password.");
						}
						let tokens = await issueToken(user);
						return {
							user: _.pick(user, [
								"_id",
								"name",
								"email",
								"username",
								"user_type",
							]),
							message: `Welcome ${params.name}`,
							...tokens,
						};
					}
				} catch (err) {
					// Implement the logger function here
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
					let refreshToken =
						ctx.options.parentCtx.params.req.headers[
							"refreshtoken"
						];
					let tokens = await issueNewTokens(refreshToken);
					if (!tokens) {
						throw new Error("Invalid Refresh Token");
					}
					return tokens;
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
			authentication: "required",
			handler: async ({ meta }) => {
				try {
					return {
						..._.pick(meta.user, [
							"_id",
							"name",
							"email",
							"username",
							"user_type",
						]),
					};
				} catch (err) {
					// Implement the logger function here
					return {
						err: err.message,
					};
				}
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
