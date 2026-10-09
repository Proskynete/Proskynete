import fs from 'fs/promises';
import { COUNT, PLACEHOLDERS, URLS, INSTAGRAM, FILES } from './constants';
import {
	handlerGetPackageVersion,
	handlerGetLatestArticles,
	handlerSliceArticles,
	handlerGetInstagramImages,
	handlerSaveInstagramImages,
	handlerGetSavedInstagramImages,
	handlerGetInstagramFileNames,
	handlerGetLatestInstagramImages,
	handlerGetTiburoncin,
	handlerGetYearsOld,
	handleGetTechnologies,
	handlerGetAdpListComments,
	handlerGetFeaturedRepositories,
	handlerRenderFeaturedRepositories,
	handlerCountLabel,
	failures,
} from './handlers';

(async () => {
	try {
		const [template, terminalTemplate, articles, images, repositories] = await Promise.all([
			fs.readFile(FILES.README_TEMPLATE, { encoding: 'utf-8' }),
			fs.readFile(FILES.TERMINAL_TEMPLATE, { encoding: 'utf-8' }),
			handlerGetLatestArticles(),
			handlerGetInstagramImages(),
			handlerGetFeaturedRepositories(),
		]);

		const _verticalTimeline = await handlerGetPackageVersion(URLS.VERTICAL_TIMELINE);
		const _prettyRating = await handlerGetPackageVersion(URLS.PRETTY_RATING);
		const _comments = await handlerGetAdpListComments(URLS.ADP_LIST_COMMENTS);
		const _articles = articles ? handlerSliceArticles(articles) : '';
		// If the API failed, the images saved by the previous run are shown instead.
		const _savedImages = images
			? await handlerSaveInstagramImages(images)
			: await handlerGetSavedInstagramImages();
		const _images = handlerGetLatestInstagramImages(_savedImages);
		const _imageFiles = handlerGetInstagramFileNames(_savedImages);
		const _yearsOld = handlerGetYearsOld();
		const _technologies = handleGetTechnologies();
		const _repositories = handlerRenderFeaturedRepositories(repositories);

		const newMarkdown = template
			.replace(PLACEHOLDERS.TECHNOLOGIES, _technologies)
			.replace(PLACEHOLDERS.PERSONAL.YEARS_OLD, _yearsOld.toString())
			.replace(PLACEHOLDERS.LIBRARIES.VERTICAL_TIMELINE, _verticalTimeline)
			.replace(PLACEHOLDERS.LIBRARIES.PRETTY_RATING, _prettyRating)
			.replace(PLACEHOLDERS.WEBSITE.NUMBER_ARTICLES, COUNT.ARTICLES.toString())
			.replace(PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.PROFILE, INSTAGRAM.USER_NAME)
			.replace(PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.NUMBER_IMAGES, COUNT.IMAGES.toString())
			.replace(PLACEHOLDERS.ADP_LIST.COUNT_COMMENTS, COUNT.COMMENTS.toString())
			.replace(PLACEHOLDERS.GITHUB.REPOSITORIES, _repositories)
			.replace(
				PLACEHOLDERS.GITHUB.REPOSITORIES_SHOWN,
				handlerCountLabel(repositories.length, 'repositorio', 'repositorios'),
			)
			.replace(
				PLACEHOLDERS.WEBSITE.ARTICLES_SHOWN,
				handlerCountLabel(Math.min(articles.length, COUNT.ARTICLES), 'artículo', 'artículos'),
			)
			.replace(PLACEHOLDERS.WEBSITE.RSS, _articles)
			.replace(PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.SECTION_IMAGES, _images)
			.replace(PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.FILES, _imageFiles)
			.replace(PLACEHOLDERS.ADP_LIST.COMMENTS, _comments);

		const newTerminal = terminalTemplate
			.replace(PLACEHOLDERS.PERSONAL.YEARS_OLD, _yearsOld.toString())
			.replace(PLACEHOLDERS.TERMINAL.TIBURONCIN, handlerGetTiburoncin());

		await fs.writeFile(FILES.README, newMarkdown);
		await fs.writeFile(FILES.TERMINAL, newTerminal);

		console.log('README.md has been generated!');

		// The README is written even when a source failed, so one dead endpoint
		// never blocks the rest. The run still exits non-zero so CI reports it
		// rather than going green with a section quietly empty.
		if (failures.length) {
			console.error(`::error::Generated with failing sources: ${failures.join(', ')}`);
			process.exit(1);
		}

		process.exit(0);
	} catch (error) {
		console.error('An error occurred while generating the README.md file');
		console.error(error);
		process.exit(1);
	}
})();
