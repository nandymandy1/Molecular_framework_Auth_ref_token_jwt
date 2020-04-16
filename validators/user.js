const Joi = require("joi");

const name = Joi.string().max(255).required().label("Name");
const email = Joi.string().email().required().label("Email");
const user_type = Joi.string().max(255).required().label("User Type");
const username = Joi.string().alphanum().min(8).max(20).label("Username");
const password = Joi.string()
	.min(8)
	.max(30)
	.regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/)
	.label("Password")
	.options({
		language: {
			string: {
				regex: {
					base:
						"Must have atleast one lowercase letter, one uppercase letter and one digit",
				},
			},
		},
	});

exports.loginValidate = Joi.object().keys({
	username,
	password,
});

exports.registerValidate = Joi.object().keys({
	name,
	email,
	username,
	password,
	user_type,
});
