const Joi = require("joi");

const name = Joi.string().max(255).required().label("Name");
const description = Joi.string().min(8).max(1500).label("Description");

exports.newCourseValidation = Joi.object().keys({
	name,
	description,
});
