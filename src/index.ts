import axios from "axios";
import { promises as fs } from 'fs';

import { PLACEHOLDERS, URLS } from './constants';
import { getVersion } from "./functions";

(async () => {
  try {
    const markdownTemplate = await fs.readFile("./README.md.tpl", {
      encoding: "utf-8",
    });

    const npmVerticalTimeline = await axios(URLS.VERTICAL_TIMELINE);
    const verticalTimelineVersion = await getVersion(npmVerticalTimeline);

    const npmPrettyRating = await axios(URLS.PRETTY_RATING);
    const prettyRatingVersion = await getVersion(npmPrettyRating);

    const newMarkdown = markdownTemplate
      .replace(PLACEHOLDERS.LIBRARIES.VERTICAL_TIMELINE, verticalTimelineVersion)
      .replace(PLACEHOLDERS.LIBRARIES.PRETTY_RATING, prettyRatingVersion);

    await fs.writeFile("./README.md", newMarkdown);
  } catch (error) {
    console.error(error);
  }
})();
