import cheerio from "cheerio";
import Parser from "rss-parser";

import { GetVersionIntrface } from "./interfaces";
import { URLS } from './constants';

const parser = new Parser();

export const getVersion = (page: GetVersionIntrface): Promise<string> => {
  return new Promise((resolve) => {
    const $ = cheerio.load(page.data);
    resolve($(URLS.TAG_ELEMENT).eq(0).text());
  });
};

export const getLatestArticles = async () =>
  parser.parseURL(URLS.RSS).then((data) => data.items);

