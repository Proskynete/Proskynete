import { promises as fs } from 'fs';

import { PLACEHOLDERS, URLS } from './constants';
import { getVersion, getLatestArticles, sliceArticles } from "./functions";


(async () => {
  try {
    const [template, articles] = await Promise.all([
      fs.readFile("./README.md.tpl", { encoding: "utf-8" }),
      getLatestArticles()
    ]);
 
    const _verticalTimeline = await getVersion(URLS.VERTICAL_TIMELINE);
    const _prettyRating = await getVersion(URLS.PRETTY_RATING);
    const _articles = articles ? sliceArticles(articles) : '';

    const newMarkdown = template
      .replace(PLACEHOLDERS.LIBRARIES.VERTICAL_TIMELINE, _verticalTimeline)
      .replace(PLACEHOLDERS.LIBRARIES.PRETTY_RATING, _prettyRating)
      .replace(PLACEHOLDERS.WEBSITE.RSS, _articles)

    await fs.writeFile("./README.md", newMarkdown);
  } catch (error) {
    console.error(error);
  }
})();
