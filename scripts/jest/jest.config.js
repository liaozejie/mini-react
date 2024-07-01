const { defaults } = require('jest-config');

module.exports = {
	...defaults,
	rootDir: process.cwd(),
	// modulePathIgnorePatterns: ['<rootDir>/.history'],
	moduleDirectories: [
		// 对于React ReactDOM
		'dist/node_module',
		// 对于第三方依赖
		...defaults.moduleDirectories
	],
	testEnvironment: 'jsdom'
};
