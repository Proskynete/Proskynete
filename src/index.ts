import { promises as fs } from 'fs';
import prettier from 'prettier';
import { COUNT, PLACEHOLDERS, URLS } from './constants';
import {
	handlerGetVersion,
	handlerGetLatestArticles,
	handlerSliceArticles,
	handlerGetInstagramImages,
	handlerGetLatestInstagramImages,
	handlerGetYearsOld,
	handleGetTechnologies,
} from './handlers';

(async () => {
	try {
		const prettierConfig = await prettier.resolveConfig('../.pretierrc');

		const [template, articles, images] = await Promise.all([
			fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
			handlerGetLatestArticles(),
			handlerGetInstagramImages(),
		]);

		const _verticalTimeline = await handlerGetVersion(URLS.VERTICAL_TIMELINE);
		const _prettyRating = await handlerGetVersion(URLS.PRETTY_RATING);
		const _articles = articles ? handlerSliceArticles(articles) : '';
		const _images = images ? handlerGetLatestInstagramImages(images) : '';
		const _yearsOld = handlerGetYearsOld();
		const _technologies = handleGetTechnologies();

		const newMarkdown = template
			.replace(PLACEHOLDERS.TECHNOLOGIES, _technologies)
			.replace(PLACEHOLDERS.PERSONAL.YEARS_OLD, _yearsOld.toString())
			.replace(PLACEHOLDERS.LIBRARIES.VERTICAL_TIMELINE, _verticalTimeline)
			.replace(PLACEHOLDERS.LIBRARIES.PRETTY_RATING, _prettyRating)
			.replace(PLACEHOLDERS.WEBSITE.NUMBER_ARTICLES, COUNT.ARTICLES.toString())
			.replace(PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.NUMBER_IMAGES, COUNT.IMAGES.toString())
			.replace(PLACEHOLDERS.WEBSITE.RSS, _articles)
			.replace(PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.SECTION_IMAGES, _images);

		const markdownFormatted = prettier.format(newMarkdown, {
			...prettierConfig,
			parser: 'mdx',
		});

		await fs.writeFile('./README.md', markdownFormatted);
	} catch (error) {
		console.error(error);
	}
})();
