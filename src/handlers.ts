import axios from 'axios';
import cheerio from 'cheerio';
import moment from 'moment';
import Parser from 'rss-parser';
import {
	URLS,
	NUMBERS,
	REGEXPS,
	YEAR_OF_BIRTH,
	INSTAGRAM_USERNAME,
	BASE_URL_TECHNOLOGIES,
} from './constants';
import {
	Article,
	ImagesInterface,
	InstagramApiResponse,
	InstagramImagesResponse,
	InstagramNodeInterface,
} from './interfaces';
import dotenv from 'dotenv';

dotenv.config();

const parser = new Parser();
moment.locale('es');

const { INSTAGRAM_API_KEY } = process.env;

/**
 * Get the version of a library published in npm.com
 * @param {GetVersionInterface} url - Url to check.
 * @returns All results according to search.
 */
export const handlerGetVersion = async (url: string): Promise<string> => {
	const file = await axios(url);

	return new Promise((resolve) => {
		const $ = cheerio.load(file.data);
		resolve($(REGEXPS.TAG_ELEMENT).eq(0).text());
	});
};

/**
 * Get all articles from some RSS page.
 * @returns All items found.
 */
export const handlerGetLatestArticles = async (): Promise<any> =>
	parser.parseURL(URLS.RSS).then((data) => data.items);

/**
 * Transform the date that we pass to a LL format (moment reference).
 * @param {string} date - Any format of date.
 * @returns format example: MM DD, YYYY
 */
export const handlerPrettyDate = (date: string): string => moment(new Date(date)).format('LL');

/**
 * Get an array of articles and transform them with a markdown format.
 * @param {array} articles - Articles obtained from an RSS.
 * @returns Link with the title, and the date of the post, with markdown syntax.
 */
export const handlerSliceArticles = (articles: Article[]): string =>
	articles
		.slice(0, NUMBERS.ARTICLES)
		.map(({ title, link, pubDate }) => (pubDate ? `- [${title}](${link})` : `[${title}](${link})`))
		.join('\n');

/**
 * Get images from any instagram profile
 * @returns A object with permalink and media_url attributes
 */
export const handlerGetInstagramImages = async (): Promise<InstagramImagesResponse[] | void> => {
	try {
		const { data } = await axios.get<InstagramApiResponse>(
			'https://instagram130.p.rapidapi.com/account-info',
			{
				params: {
					username: INSTAGRAM_USERNAME,
				},
				headers: {
					'X-RapidAPI-Host': 'instagram130.p.rapidapi.com',
					'X-RapidAPI-Key': INSTAGRAM_API_KEY as string,
				},
			},
		);

		const images: InstagramNodeInterface[] = data.edge_owner_to_timeline_media.edges;

		return (
			images &&
			images.map((image) => {
				return {
					permalink: image.node.shortcode,
					media_url: image.node.thumbnail_src,
					accessibility: image.node.accessibility_caption,
					description: image.node.edge_media_to_caption.edges.length
						? image.node.edge_media_to_caption.edges[0].node.text
								.replace(/(\r\n|\n|\r)/gm, ' ')
								.trim()
						: '',
				};
			})
		);
	} catch (err) {
		console.error(err);
		throw new Error();
	}
};

/**
 * Transform the string of images to mdx format and slice the result
 * @param {InstagramImagesResponse[]} images - Array of { permalink, media_url } attributes
 * @returns An array of links with images obtained from instagram
 */
export const handlerGetLatestInstagramImages = (images: InstagramImagesResponse[]): string =>
	images
		.slice(0, NUMBERS.IMAGES)
		.map(
			({
				media_url,
				permalink,
				accessibility,
			}) => `<a href='https://instagram.com/p/${permalink}' target='_blank'>
				<img
					src='${media_url}'
					alt='${accessibility}'
					width='150'
					height='150'
				/>
    </a>`,
		)
		.join('');

/**
 * Get the number of years from the year of birth to now
 * @returns Number of years
 */
export const handlerGetYearsOld = (): number => moment().diff(YEAR_OF_BIRTH, 'years');

/**
 * Create array of technologies that I know
 * @returns Array of technologies
 */
export const handleGetTechnologies = () => {
	const _array: ImagesInterface[] = [
		{ file_name: 'ts', technology: 'Typescript' },
		{ file_name: 'js', technology: 'Javascript' },
		{ file_name: 'html5', technology: 'HTML5' },
		{ file_name: 'css3', technology: 'CSS3' },
		{ file_name: 'bootstrap', technology: 'Bootstrap' },
		{ file_name: 'sass', technology: 'Sass' },
		{ file_name: 'react', technology: 'React' },
		{ file_name: 'redux', technology: 'Redux' },
		{ file_name: 'node', technology: 'Nodejs' },
		{ file_name: 'mongodb', technology: 'MongoDB' },
		{ file_name: 'dart', technology: 'Dart' },
		{ file_name: 'flutter', technology: 'Flutter' },
		{ file_name: 'aws', technology: 'Amazon Web Services' },
		{ file_name: 'git', technology: 'Git' },
	];

	return _array
		.map(
			({ file_name, technology }) =>
				`<img
					src='${BASE_URL_TECHNOLOGIES}/${file_name}.png?raw=true'
					alt=${technology}
					width='25'
					height='25'
				/>`,
		)
		.join(' ');
};
