"use strict";

const Joi = require("joi");
const { Course } = require("../models");
const { newCourseValidation } = require("../validators/course");
const { logger, errlogger } = require("../functions/logger");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "courses",
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
		createCourse: {
			rest: {
				method: "POST",
				path: "/",
			},
			role: "guru",
			auth: "required",
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
					logger.info(`
						COURSE_CREATED
						COURSE_ID: ${result._id}
						by USER_ID: ${result.author}
					`);
					return result;
				} catch (err) {
					errlogger.info(`
						CREATE_COURSE_ERROR 
						MESSAGE: ${err.message}
						by UserID: ${meta.user._id}
					`);
					return {
						err: err.message,
					};
				}
			},
		},
		getAllCourses: {
			rest: {
				method: "GET",
				path: "/",
			},
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
						limit: 10,
						collation: {
							locale: "en",
						},
						sort: {
							createdAt: -1,
						},
						populate: {
							path: "author",
							select: "name username _id",
						},
						customLabels: paginatorLabels,
						page: params.page ? params.page : 1,
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
