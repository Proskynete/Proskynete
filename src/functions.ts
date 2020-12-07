import cheerio from "cheerio";

import { GetVersionIntrface } from "./interfaces";
import { URLS } from './constants';

export const getVersion = (page: GetVersionIntrface): Promise<string> => {
  return new Promise((resolve) => {
    const $ = cheerio.load(page.data);
    resolve($(URLS.TAG_ELEMENT).eq(0).text());
  });
};