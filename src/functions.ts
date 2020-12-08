import cheerio from "cheerio";
import Parser from "rss-parser";
import moment from 'moment';

import { GetVersionIntrface } from "./interfaces";
import { URLS, NUMBERS } from './constants';

const parser = new Parser();
moment.locale('en');

export const getVersion = (page: GetVersionIntrface): Promise<string> =>
  new Promise((resolve) => {
    const $ = cheerio.load(page.data);
    resolve($(URLS.TAG_ELEMENT).eq(0).text());
  });

export const getLatestArticles = async () =>
  parser.parseURL(URLS.RSS).then((data) => data.items);

export const prettyDate = (date: string): string => moment(new Date(date)).format('LL');

export const sliceArticles = (articles: Parser.Item[]) =>
  articles.slice(0, NUMBERS.ARTICLES).map(({ title, link, pubDate }) =>
    pubDate
      ? `[${title}](${link}) - <small>Posted on ${prettyDate(pubDate)}</small>`
      : `[${title}](${link})`
  ).join('\n');