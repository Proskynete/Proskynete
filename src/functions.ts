import cheerio from "cheerio";
import Parser from "rss-parser";
import moment from 'moment';

import { GetVersionIntrface } from "./interfaces";
import { URLS } from './constants';

const parser = new Parser();
moment.locale('es');

export const getVersion = (page: GetVersionIntrface): Promise<string> =>
  new Promise((resolve) => {
    const $ = cheerio.load(page.data);
    resolve($(URLS.TAG_ELEMENT).eq(0).text());
  });

export const getLatestArticles = async () =>
  parser.parseURL(URLS.RSS).then((data) => data.items);

export const prettyDate = (date: string): string => moment(new Date(date)).format('LL');