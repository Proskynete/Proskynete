import axios from "axios";
import cheerio from "cheerio";
import { promises as fs } from 'fs';

import { PLACEHOLDERS, URLS } from './constants';

interface GetVersionIntrface {
  data: string;
}

const getVersion = (page: GetVersionIntrface): Promise<string> => {
  return new Promise((resolve) => {
    const $ = cheerio.load(page.data);
    resolve($(URLS.TAG_ELEMENT).eq(0).text());
  });
};

(async () => {
  try {
    const markdownTemplate = await fs.readFile("./README.md.tpl", {
      encoding: "utf-8",
    });

    const npmVerticalTimeline = await axios(URLS.VERTICAL_TIMELINE);
    const verticalTimelineVersion = await getVersion(npmVerticalTimeline);

    const npmPrettyRating = await axios(URLS.PRETTY_RATING);
    const prettyRatingVersion = await getVersion(npmPrettyRating);

    let newMarkdown = markdownTemplate
      .replace(PLACEHOLDERS.LIBRARIES.VERTICAL_TIMELINE, verticalTimelineVersion)
      .replace(PLACEHOLDERS.LIBRARIES.PRETTY_RATING, prettyRatingVersion);

    await fs.writeFile("./README.md", newMarkdown);
  } catch (e) {
    console.log(e);
  }
})();
