const { model, Schema } = require("mongoose");
const { hash, compare } = require("bcryptjs");

const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			validate: {
				validator: (username) => User.dontExist({ username }),
				message: ({ value }) =>
					`Username ${value} has already been taken.`,
			},
		},
		email: {
			type: String,
			required: true,
			validate: {
				validator: (email) => User.dontExist({ email }),
				message: ({ value }) =>
					`Email ${value} has already been taken.`,
			},
		},
		password: {
			type: String,
			required: true,
		},
		user_type: {
			type: String,
			default: "student",
			enum: ["student", "guru", "developer"],
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.pre("save", async function () {
	if (this.isModified("password")) {
		this.password = await hash(this.password, 12);
	}
});

UserSchema.statics.dontExist = async function (options) {
	return (await this.where(options).countDocuments()) === 0;
};

UserSchema.statics.findByQuery = async function (opts) {
	return await this.findOne(opts);
};

UserSchema.methods.passwordCompare = async function (password) {
	let isMatch = await compare(password, this.password);
	return isMatch;
};

const User = model("users", UserSchema);
module.exports = User;
