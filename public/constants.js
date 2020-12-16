"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NUMBERS = exports.REGEXPS = exports.URLS = exports.PLACEHOLDERS = void 0;
var BASE_NPM_URL = "https://www.npmjs.com/package";
var BASE_WEBSITE = "https://eduardoalvarez.dev";
exports.PLACEHOLDERS = {
    LIBRARIES: {
        VERTICAL_TIMELINE: "%{{vt-version}}%",
        PRETTY_RATING: "%{{pr-version}}%"
    },
    WEBSITE: {
        RSS: "%{{articles}}%"
    },
    SOCIAL_MEDIA: {
        INSTAGRAM: "%{{instagram_images}}%"
    }
};
exports.URLS = {
    VERTICAL_TIMELINE: BASE_NPM_URL + "/vertical-timeline-component-react",
    PRETTY_RATING: BASE_NPM_URL + "/pretty-rating-react",
    INSTAGRAM: 'https://instagram.com/proskynete',
    RSS: BASE_WEBSITE + "/rss.xml"
};
exports.REGEXPS = {
    INSTAGRAM: new RegExp(/<script type="text\/javascript">window\._sharedData = (.*);<\/script>/),
    TAG_ELEMENT: "p.f2874b88.fw6.mb3.mt2.truncate.black-80.f4"
};
exports.NUMBERS = {
    ARTICLES: 5,
    IMAGES: 5
};
//# sourceMappingURL=constants.js.map