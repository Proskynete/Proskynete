import axios from "axios";
import cheerio from "cheerio";
import Parser from "rss-parser";
import moment from 'moment';

import { URLS, NUMBERS } from './constants';

const parser = new Parser();
moment.locale('en');

/**
 * Get the version of a library published in npm.com
 * @param {GetVersionInterface} url - Url to check.
 * @returns {Promise<string>} All results according to search.
 */
export const getVersion = async (url: string): Promise<string> => {
  const file = await axios(url);

  return new Promise((resolve) => {
    const $ = cheerio.load(file.data);
    resolve($(URLS.TAG_ELEMENT).eq(0).text());
  });
}
  
/**
 * Get all articles from some RSS page.
 * @returns {Parser.Item[]} All items found.
 */
export const getLatestArticles = async () =>
  parser.parseURL(URLS.RSS).then((data) => data.items);

  /**
   * Transform the date that we pass to a LL format (moment reference).
   * @param {string} date - Any format of date.
   * @returns {string} format example: MM DD, YYYY
   */
export const prettyDate = (date: string): string => moment(new Date(date)).format('LL');

/**
 * Get an array of articles and transform them with a markdown format.
 * @param {array} articles - Articles obtained from an RSS.
 * @returns {string} Link with the title, and the date of the post, with markdown syntax.
 */
export const sliceArticles = (articles: Parser.Item[]): string =>
  articles.slice(0, NUMBERS.ARTICLES).map(({ title, link, pubDate }) =>
    pubDate
      ? `[${title}](${link}) - <small>Posted on ${prettyDate(pubDate)}</small>`
      : `[${title}](${link})`
  ).join('\n');