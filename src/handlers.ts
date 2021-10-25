import _ from 'lodash';
import axios from 'axios';
import cheerio from 'cheerio';
import moment from 'moment';
import Parser from 'rss-parser';

import { URLS, NUMBERS, REGEXPS, YEAR_OF_BIRTH, PROSKYNETE } from './constants';
import { InstagramImagesResponse, InstagramNodeInterface } from './interfaces';

const parser = new Parser();
moment.locale('es');

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
export const hanlderSliceArticles = (articles: Parser.Item[]): string =>
	articles
		.slice(0, NUMBERS.ARTICLES)
		.map(({ title, link, pubDate }) =>
			pubDate
				? `- [${title}](${link}) - <small>Publicado el ${handlerPrettyDate(pubDate)}</small>`
				: `[${title}](${link})`,
		)
		.join('\n');

/**
 * Get images from any instagram profile
 * @returns A object with permalink and media_url attributes
 */
export const handlerGetInstagramImages = async (): Promise<InstagramImagesResponse[]> => {
	const { data } = await axios.get(
		`https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={"id":${PROSKYNETE},"first":${NUMBERS.IMAGES},"after":null}`,
	);

	const { edges } = data.data.user.edge_owner_to_timeline_media;

	return edges.map(({ node }: InstagramNodeInterface) => {
		return {
			permalink: `https://www.instagram.com/p/${node.shortcode}/`,
			media_url: node.thumbnail_src,
			description: !_.isEmpty(node.edge_media_to_caption.edges)
				? node.edge_media_to_caption.edges[0].node.text
				: '',
		};
	});
};

/**
 * Trasnform the string of images to mdx format and slice the result
 * @param {InstagramImagesResponse[]} images - Array of { permalink, media_url } attributes
 * @returns An array of links wirth images obtained from instagram
 */
export const handlerGetLatestInstagramImages = (images: InstagramImagesResponse[]): string =>
	images
		.slice(0, NUMBERS.IMAGES)
		.map(
			({ media_url, permalink }) => `<a href='${permalink}' target='_blank'>
				<img
					src='${media_url}'
					alt='Instagram image'
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
