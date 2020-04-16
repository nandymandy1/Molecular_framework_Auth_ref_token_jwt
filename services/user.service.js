"use strict";

const Joi = require("joi");
const _ = require("lodash");
const { User, Course } = require("../models");
const { newCourseValidation } = require("../validators/course");
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
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
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
		createCourse: {
			rest: {
				method: "POST",
				path: "/courses",
			},
			authentication: "required",
			handler: async ({ params, meta }) => {
				try {
					await Joi.validate(params, newCourseValidation, {
						abortEarly: false,
					});
					let newCourse = new Course({
						...params,
						author: meta.user._id,
					});
					let result = await newCourse.save();
					return result;
				} catch (err) {
					return {
						err: err.message,
					};
				}
			},
		},
		getAllCourses: {
			rest: {
				method: "GET",
				path: "/courses",
			},
			// authentication: "required",
			handler: async ({ params }) => {
				try {
					const paginatorLabels = {
						docs: "courses",
						limit: "perPage",
						nextPage: "next",
						prevPage: "prev",
						meta: "paginator",
						page: "currentPage",
						pagingCounter: "slNo",
						totalPages: "pageCount",
						totalDocs: "totalCourses",
					};
					const options = {
						page: params.page ? params.page : 1,
						limit: 10,
						collation: {
							locale: "en",
						},
						customLabels: paginatorLabels,
						select: "name description author",
						sort: { createdAt: -1 },
						populate: {
							path: "author",
							select: "name username _id",
						},
					};
					return await Course.paginate({}, options);
				} catch (err) {
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
