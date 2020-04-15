// const fs = require("fs");
const _ = require("lodash");
const { User } = require("../models");
const { sign, verify } = require("jsonwebtoken");
const { AUTH_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../config/index");

const issueToken = async (user) => {
	let payload = _.pick(user, ["username", "email", "_id"]);
	let authToken = await sign(payload, AUTH_TOKEN_SECRET, { expiresIn: 60 });
	let refreshToken = await sign(payload, REFRESH_TOKEN_SECRET, {
		expiresIn: "2 days",
	});
	return {
		authToken: `Bearer ${authToken}`,
		refreshToken: `Bearer ${refreshToken}`,
	};
};

const authMiddleware = async (token) => {
	try {
		token = token.replace("Bearer ", "");
		let { _id } = await verify(token, AUTH_TOKEN_SECRET);
		const authUser = await User.findById(_id);
		if (!authUser) {
			throw new Error("Unauthenticated");
		} else {
			return authUser;
		}
	} catch (err) {
		return null;
	}
};

const issueNewTokens = async (refreshToken) => {
	try {
		let token = refreshToken.replace("Bearer ", "");
		let { _id } = await verify(token, REFRESH_TOKEN_SECRET);
		const authUser = await User.findById(_id);
		if (!authUser) {
			throw new Error("Invalid Refresh Token");
		} else {
			return await issueToken(authUser);
		}
	} catch (err) {
		return null;
	}
};

module.exports = {
	issueToken,
	issueNewTokens,
	authMiddleware,
};
