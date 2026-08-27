"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLS = exports.FEATURED_REPOSITORIES = exports.PERSONAL = exports.INSTAGRAM = exports.BASE_URL = exports.COUNT = exports.REGEXPS = exports.PLACEHOLDERS = void 0;
exports.PLACEHOLDERS = {
    TECHNOLOGIES: '%{{technologies}}%',
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
            PROFILE: '%{{instagram_profile}}%',
        },
    },
    ADP_LIST: {
        COMMENTS: '%{{adp_list_comments}}%',
        COUNT_COMMENTS: '%{{number_comments}}%',
    },
    GITHUB: {
        REPOSITORIES: '%{{repositories}}%',
    },
};
exports.REGEXPS = {
    TAG_ELEMENT: 'p.f2874b88.fw6.mb3.mt2.truncate.black-80.f4',
};
exports.COUNT = {
    ARTICLES: 5,
    IMAGES: 4,
    COMMENTS: 3,
    REPOSITORIES: 4,
};
exports.BASE_URL = {
    NPM: 'https://www.npmjs.com/package',
    WEBSITE: 'https://eduardoalvarez.dev',
    TECHNOLOGIES: 'https://github.com/Proskynete/Proskynete/blob/main/images/icons',
    INSTAGRAM_API: 'https://rocketapi-for-developers.p.rapidapi.com/instagram/user/get_media',
    ADP_LIST: 'https://api2.adplist.org',
    GITHUB_API: 'https://api.github.com',
};
exports.INSTAGRAM = {
    USER_ID: 41056689992,
    USER_NAME: 'eduardo_alvarez.dev',
};
exports.PERSONAL = {
    YEAR_OF_BIRTH: '1993-12-24',
    ADP_USER_ID: 983411,
    GITHUB_USER: 'Proskynete',
};
exports.FEATURED_REPOSITORIES = [
    'vertical-timeline-component-react',
    'pretty-rating-react',
    'node-api-skeleton',
    'cypress-cucumber-boilerplate',
];
exports.URLS = {
    VERTICAL_TIMELINE: 'vertical-timeline-component-react',
    PRETTY_RATING: 'pretty-rating-react',
    RSS: `${exports.BASE_URL.WEBSITE}/rss.xml`,
    ADP_LIST_COMMENTS: `${exports.BASE_URL.ADP_LIST}/core/review/?user_id=${exports.PERSONAL.ADP_USER_ID}`,
};
//# sourceMappingURL=constants.js.map