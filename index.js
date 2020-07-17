const fs = require('fs').promises;

(async () => {
	const markdownTemplate = await fs.readFile('./README.md.tpl', {
		encoding: 'utf-8',
	});
	await fs.writeFile('./README.md', markdownTemplate);
})();
