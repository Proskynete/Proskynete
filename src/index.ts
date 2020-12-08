import axios from "axios";
import { promises as fs } from 'fs';

import { PLACEHOLDERS, URLS } from './constants';
import { getVersion, getLatestArticles, sliceArticles } from "./functions";


(async () => {
  try {
    const [template, articles] = await Promise.all([
      fs.readFile("./README.md.tpl", { encoding: "utf-8" }),
      getLatestArticles()
    ]);
 
    const npmVerticalTimeline = await axios(URLS.VERTICAL_TIMELINE);
    const verticalTimelineVersion = await getVersion(npmVerticalTimeline);

    const npmPrettyRating = await axios(URLS.PRETTY_RATING);
    const prettyRatingVersion = await getVersion(npmPrettyRating);

    const articlesMarkdown = articles ? sliceArticles(articles) : '';

    const newMarkdown = template
      .replace(PLACEHOLDERS.LIBRARIES.VERTICAL_TIMELINE, verticalTimelineVersion)
      .replace(PLACEHOLDERS.LIBRARIES.PRETTY_RATING, prettyRatingVersion)
      .replace(PLACEHOLDERS.WEBSITE.RSS, articlesMarkdown)

    await fs.writeFile("./README.md", newMarkdown);
  } catch (error) {
    console.error(error);
  }
})();
