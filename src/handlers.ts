import axios from 'axios';
import cheerio from 'cheerio';
import moment from 'moment';
import Parser from 'rss-parser';
import { URLS, COUNT, REGEXPS, PERSONAL, INSTAGRAM, BASE_URL } from './constants';
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
 * It takes a URL as an argument, fetches the HTML of the page, and returns the
 * version number of the software
 * @param {string} url - The URL of the page to be scraped.
 * @returns The version of the package.
 */
export const handlerGetVersion = async (url: string): Promise<string> => {
	const file = await axios(url);

	return new Promise((resolve) => {
		const $ = cheerio.load(file.data);
		resolve($(REGEXPS.TAG_ELEMENT).eq(0).text());
	});
};

/**
 * It fetches the RSS feed from the URL, parses it, and returns the items
 */
export const handlerGetLatestArticles = async (): Promise<any> =>
	parser.parseURL(URLS.RSS).then((data) => data.items);

/**
 * It takes a date string, converts it to a Date object, then uses the moment.js
 * library to format it as a long date
 * @param {string} date - The date you want to format.
 */
export const handlerPrettyDate = (date: string): string => moment(new Date(date)).format('LL');

/**
 * It takes an array of articles, slices it to the first 5 articles, and then maps
 * each article to a markdown link
 * @param {Article[]} articles - Article[] - the array of articles to be sliced
 */
export const handlerSliceArticles = (articles: Article[]): string =>
	articles
		.slice(0, COUNT.ARTICLES)
		.map(({ title, link, pubDate }) => (pubDate ? `- [${title}](${link})` : `[${title}](${link})`))
		.join('\n');

/**
 * It makes a request to the Instagram API, gets the data, and returns an array of
 * objects with the data we need
 * @returns An array of InstagramImagesResponse objects.
 */
export const handlerGetInstagramImages = async (): Promise<InstagramImagesResponse[] | void> => {
	try {
		const { data } = await axios.get<InstagramApiResponse>(
			`${BASE_URL.INSTAGRAM_API}?userid=${INSTAGRAM.USER_ID}&first=${COUNT.IMAGES}`,
			{
				headers: {
					'X-RapidAPI-Host': 'instagram130.p.rapidapi.com',
					'X-RapidAPI-Key': INSTAGRAM_API_KEY as string,
				},
			},
		);

		const images: InstagramNodeInterface[] = data.edges;

		return (
			images &&
			images.map((image) => ({
				permalink: image.node.shortcode,
				media_url: image.node.thumbnail_src,
				accessibility: image.node.accessibility_caption,
				description: image.node.edge_media_to_caption.edges.length
					? image.node.edge_media_to_caption.edges[0].node.text
							.replace(/(\r\n|\n|\r)/gm, ' ')
							.trim()
					: '',
			}))
		);
	} catch (err) {
		console.error(err);
		throw new Error();
	}
};

/**
 * It takes an array of Instagram images, slices it to the first 10 images, and
 * returns a string of HTML image tags
 * @param {InstagramImagesResponse[]} images - InstagramImagesResponse[] - this is
 * the response from the Instagram API.
 */
export const handlerGetLatestInstagramImages = (images: InstagramImagesResponse[]): string =>
	images
		.slice(0, COUNT.IMAGES)
		.map(
			({
				media_url,
				permalink,
				accessibility,
				description,
			}) => `<a href='https://instagram.com/p/${permalink}' target='_blank'>
				<img
					src='${media_url}'
					alt='${accessibility ?? description}'
					width='150'
					height='150'
				/>
    </a>`,
		)
		.join('');

/**
 * > It returns the number of years old I am
 */
export const handlerGetYearsOld = (): number => moment().diff(PERSONAL.YEAR_OF_BIRTH, 'years');

/**
 * It takes an array of objects, maps over each object, and returns a string of
 * HTML
 * @returns A string of images
 */
export const handleGetTechnologies = () => {
	const _array: ImagesInterface[] = [
		{ file_name: 'ts', technology: 'Typescript' },
		{ file_name: 'js', technology: 'Javascript' },
		{ file_name: 'react', technology: 'React' },
		{ file_name: 'redux', technology: 'Redux' },
		{ file_name: 'html5', technology: 'HTML5' },
		{ file_name: 'css3', technology: 'CSS3' },
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
					src='${BASE_URL.TECHNOLOGIES}/${file_name}.png?raw=true'
					alt=${technology}
					width='25'
					height='25'
				/>`,
		)
		.join(' ');
};
