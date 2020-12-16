import axios from "axios";
import cheerio from "cheerio";
import Parser from "rss-parser";
import moment from 'moment';

import { URLS, NUMBERS, REGEXPS } from './constants';
import { InstagramImagesResponse, InstagramNodeInterface } from "./interfaces";

const parser = new Parser();
moment.locale('en');

/**
 * Get the version of a library published in npm.com
 * @param {GetVersionInterface} url - Url to check.
 * @returns All results according to search.
 */
export const getVersion = async (url: string): Promise<string> => {
  const file = await axios(url);

  return new Promise((resolve) => {
    const $ = cheerio.load(file.data);
    resolve($(REGEXPS.TAG_ELEMENT).eq(0).text());
  });
}

/**
 * Get all articles from some RSS page.
 * @returns All items found.
 */
export const getLatestArticles = async () =>
  parser.parseURL(URLS.RSS).then((data) => data.items);

  /**
   * Transform the date that we pass to a LL format (moment reference).
   * @param {string} date - Any format of date.
   * @returns format example: MM DD, YYYY
   */
export const prettyDate = (date: string): string => moment(new Date(date)).format('LL');

/**
 * Get an array of articles and transform them with a markdown format.
 * @param {array} articles - Articles obtained from an RSS.
 * @returns Link with the title, and the date of the post, with markdown syntax.
 */
export const sliceArticles = (articles: Parser.Item[]): string =>
  articles.slice(0, NUMBERS.ARTICLES).map(({ title, link, pubDate }) =>
    pubDate
      ? `[${title}](${link}) - <small>Posted on ${prettyDate(pubDate)}</small>`
      : `[${title}](${link})`
  ).join('\n');

  /**
   * Get images from any instagram profile
   * @returns A object with permalink and media_url attributes
   */
export const getInstagramImages =  async (): Promise<InstagramImagesResponse[]> => {
  const { data } = await axios(URLS.INSTAGRAM);
  const json = JSON.parse(data.match(REGEXPS.INSTAGRAM)[1]);
  const edges = json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(
    0,
    8
  );

  return edges.map(({ node }: InstagramNodeInterface) => ({
    permalink: `https://www.instagram.com/p/${node.shortcode}/`,
    media_url: node.thumbnail_src,
  }));
}

/**
 * 
 * Trasnform the string of images to mdx format and slice the result 
 * @param {InstagramImagesResponse[]} images - Array of { permalink, media_url } attributes
 * @returns An array of links wirth images obtained from instagram
 */
export const latestInstagramImages = (images: InstagramImagesResponse[]) =>
  images
    .slice(0, NUMBERS.IMAGES)
    .map(({ media_url, permalink }) => (
    `<a href='${permalink}' target='_blank'>
      <img src='${media_url}' alt='Instagram photo' width='170px' height='170px'  />
    </a>`))
    .join('');