import { promises as fs } from 'fs';
import { COUNT, PLACEHOLDERS, URLS } from './constants';
import {
	handlerGetPackageVersion,
	handlerGetLatestArticles,
	handlerSliceArticles,
	handlerGetInstagramImages,
	handlerGetLatestInstagramImages,
	handlerGetYearsOld,
	handleGetTechnologies,
	handlerGetAdpListComments,
} from './handlers';

(async () => {
	try {
		const [template, articles, images] = await Promise.all([
			fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
			handlerGetLatestArticles(),
			handlerGetInstagramImages(),
		]);

		const _verticalTimeline = await handlerGetPackageVersion(URLS.VERTICAL_TIMELINE);
		const _prettyRating = await handlerGetPackageVersion(URLS.PRETTY_RATING);
		const _comments = await handlerGetAdpListComments(URLS.ADP_LIST_COMMENTS);
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
			.replace(PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.SECTION_IMAGES, _images)
			.replace(PLACEHOLDERS.ADP_LIST.COMMENTS, _comments);

		await fs.writeFile('./README.md', newMarkdown);
	} catch (error) {
		console.error(error);
	}
})();
