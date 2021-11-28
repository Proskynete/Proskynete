"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NUMBERS = exports.REGEXPS = exports.URLS = exports.PLACEHOLDERS = exports.PROSKYNETE = exports.YEAR_OF_BIRTH = exports.BASE_WEBSITE = exports.BASE_NPM_URL = void 0;
exports.BASE_NPM_URL = 'https://www.npmjs.com/package';
exports.BASE_WEBSITE = 'https://eduardoalvarez.dev';
exports.YEAR_OF_BIRTH = '1993-12-24';
exports.PROSKYNETE = 42938370;
exports.PLACEHOLDERS = {
    PERSONAL: {
        YEARS_OLD: '%{{years_old}}%',
    },
    LIBRARIES: {
        VERTICAL_TIMELINE: '%{{vt_version}}%',
        PRETTY_RATING: '%{{pr_version}}%',
    },
    WEBSITE: {
        NUMBER_ARTICLES: '%{{number_articles}}%',
        RSS: '%{{articles}}%',
    },
    SOCIAL_MEDIA: {
        INSTAGRAM: {
            NUMBER_IMAGES: '%{{number_images}}%',
            SECTION_IMAGES: '%{{instagram_images}}%',
        },
    },
};
exports.URLS = {
    VERTICAL_TIMELINE: `${exports.BASE_NPM_URL}/vertical-timeline-component-react`,
    PRETTY_RATING: `${exports.BASE_NPM_URL}/pretty-rating-react`,
    RSS: `${exports.BASE_WEBSITE}/rss.xml`,
};
exports.REGEXPS = {
    TAG_ELEMENT: 'p.f2874b88.fw6.mb3.mt2.truncate.black-80.f4',
};
exports.NUMBERS = {
    ARTICLES: 5,
    IMAGES: 5,
};
//# sourceMappingURL=constants.js.map