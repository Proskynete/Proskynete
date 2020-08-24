const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises;

const baseurl = "https://www.npmjs.com/package/";
const verticalTimelineURl = `${baseurl}vertical-timeline-component-react`;
const prettyRatingURl = `${baseurl}pretty-rating-react`;
const tagElement = "p.f2874b88.fw6.mb3.mt2.truncate.black-80.f4";

const PLACEHOLDER_VERTICAL_TIMELINE_VERSION = "%{{vt-version}}%";
const PLACEHOLDER_PRETTY_RATING_VERSION = "%{{pr-version}}%";

const getVersion = (page) => {
  return new Promise((resolve, _) => {
    const $ = cheerio.load(page.data);
    return resolve($(tagElement).eq(0).text());
  });
};

(async () => {
  try {
    const markdownTemplate = await fs.readFile("./README.md.tpl", {
      encoding: "utf-8",
    });

    const npmVerticalTimeline = await axios(verticalTimelineURl);
    const verticalTimelineVersion = await getVersion(npmVerticalTimeline);

    const npmPrettyRating = await axios(prettyRatingURl);
    const prettyRatingVersion = await getVersion(npmPrettyRating);

    let newMarkdown = markdownTemplate
      .replace(PLACEHOLDER_VERTICAL_TIMELINE_VERSION, verticalTimelineVersion)
      .replace(PLACEHOLDER_PRETTY_RATING_VERSION, prettyRatingVersion);

    await fs.writeFile("./README.md", newMarkdown);
  } catch (e) {
    console.log(e);
  }
})();
