module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	ignorePatterns: ['./public'],
	plugins: ['@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	rules: {
		'no-console': 0,
		'@typescript-eslint/no-explicit-any': 0,
		'no-underscore-dangle': 0,
		'@typescript-eslint/naming-convention': 0,
	},
};
