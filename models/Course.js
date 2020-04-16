const { Schema, model } = require("mongoose");
const paginator = require("mongoose-paginate-v2");

const CourseSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{
		timestamps: true,
	}
);

CourseSchema.plugin(paginator);

const Course = model("courses", CourseSchema);

module.exports = Course;
