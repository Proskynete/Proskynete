module.exports = {
	extends: [
		'airbnb-typescript',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: ['./tsconfig.json'],
		tsconfigRootDir: __dirname,
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	rules: {
		'no-console': 0,
		'import/order': ['error', { alphabetize: { order: 'asc' } }],
		'@typescript-eslint/no-explicit-any': 0,
		'no-underscore-dangle': 0,
		'@typescript-eslint/naming-convention': 0,
	},
};
