module.exports = {
	root: true,
	env: {
		es6: true,
		node: true,
		jest: true,
		jquery: false,
		jasmine: true,
		commonjs: true,
	},
	parserOptions: {
		ecmaVersion: "2018",
		sourceType: "module",
	},
	rules: {
		"no-var": ["error"],
		"no-console": ["off"],
		semi: ["error", "always"],
		quotes: ["warn", "double"],
		"no-unused-vars": ["warn"],
		"no-mixed-spaces-and-tabs": ["warn"],
		indent: ["warn", "tab", { SwitchCase: 1 }],
	},
	extends: "eslint:recommended",
};
