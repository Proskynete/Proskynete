import axios, { AxiosError } from 'axios';
import cheerio from 'cheerio';
import * as core from '@actions/core';
import Parser from 'rss-parser';
import { URLS, COUNT, REGEXPS, PERSONAL, INSTAGRAM, BASE_URL } from './constants';
import {
	Article,
	GetCommentFromADPListResponse,
	ImagesInterface,
	InstagramApiResponse,
	InstagramImagesResponse,
	InstagramNodeInterface,
} from './interfaces';
import dotenv from 'dotenv';

dotenv.config();

const parser = new Parser();

const { INSTAGRAM_API_KEY } = process.env;

/**
 * It takes a URL as an argument, fetches the HTML of the page, and returns the
 * version number of the software
 * @param {string} url - The URL of the page to be scraped.
 * @returns The version of the package.
 */
export const handlerGetPackageVersion = async (url: string): Promise<string> => {
	const file = await axios(url);

	return new Promise((resolve) => {
		const $ = cheerio.load(file.data);
		resolve($(REGEXPS.TAG_ELEMENT).eq(0).text());
	});
};

export const prettyDateFormat = (date: string): string =>
	new Date(date).toLocaleDateString('es-CL', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});

export const handlerGetAdpListComments = async (url: string) => {
	const { data } = await axios<GetCommentFromADPListResponse[]>(url);

	return data
		.slice(0, COUNT.COMMENTS)
		.map(
			({ review, reviewed_by, date_reviewed }) =>
				`<li><i>"${review}"</i> - ${reviewed_by.name} <small>(${prettyDateFormat(
					date_reviewed,
				)})</small></li>`,
		)
		.join('\n');
};

/**
 * It fetches the RSS feed from the URL, parses it, and returns the items
 */
export const handlerGetLatestArticles = async (): Promise<any> =>
	parser.parseURL(URLS.RSS).then((data) => data.items);

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
		const { data } = await axios.get<InstagramApiResponse>(BASE_URL.INSTAGRAM_API, {
			timeout: 20000,
			params: {
				id_user: INSTAGRAM.USER_ID,
			},
			headers: {
				'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com',
				'X-RapidAPI-Key': INSTAGRAM_API_KEY as string,
			},
		});

		const images: InstagramNodeInterface[] = data.data?.user?.edge_owner_to_timeline_media.edges;

		return (
			images &&
			images.map((image) => ({
				code: image.node.shortcode,
				url: image.node.thumbnail_src,
				accessibility: image.node.accessibility_caption,
				description: image.node.edge_media_to_caption.edges.length
					? image.node.edge_media_to_caption.edges[0].node.text
							.replace(/(\r\n|\n|\r)/gm, ' ')
							.trim()
					: '',
			}))
		);
	} catch (err) {
		if (axios.isAxiosError(err)) {
			const { response } = err as AxiosError;
			if (response) core.setFailed(err.message);
			process.exit(1);
		}
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
				code,
				url,
				accessibility,
				description,
			}) => `<a href='https://instagram.com/p/${code}' target='_blank'>
				<img
					src='${url}'
					alt='${accessibility ?? description}'
					width='150'
					height='150'
				/>
    </a>`,
		)
		.join('');

export const handlerGetYearsOld = (): number =>
	dateDifferenceInYears(new Date(PERSONAL.YEAR_OF_BIRTH), new Date());

const dateDifferenceInMonths = (dateInitial: Date, dateFinal: Date) =>
	Math.max(
		(dateFinal.getFullYear() - dateInitial.getFullYear()) * 12 +
			dateFinal.getMonth() -
			dateInitial.getMonth(),
		0,
	);

const dateDifferenceInYears = (dateInitial: Date, dateFinal: Date) =>
	Math.trunc(dateDifferenceInMonths(dateInitial, dateFinal) / 12);

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
		{ file_name: 'vue', technology: 'Vue' },
		{ file_name: 'svelte', technology: 'Svelte' },
		{ file_name: 'redux', technology: 'Redux' },
		{ file_name: 'html5', technology: 'HTML5' },
		{ file_name: 'css3', technology: 'CSS3' },
		{ file_name: 'node', technology: 'Nodejs' },
		{ file_name: 'mongodb', technology: 'MongoDB' },
		{ file_name: 'dart', technology: 'Dart' },
		{ file_name: 'flutter', technology: 'Flutter' },
		{ file_name: 'aws', technology: 'Amazon Web Services' },
		{ file_name: 'git', technology: 'Git' },
		{ file_name: 'firebase', technology: 'Firebase' },
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
