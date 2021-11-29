"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerGetYearsOld = exports.handlerGetLatestInstagramImages = exports.handlerGetInstagramImages = exports.hanlderSliceArticles = exports.handlerPrettyDate = exports.handlerGetLatestArticles = exports.handlerGetVersion = void 0;
const lodash_1 = __importDefault(require("lodash"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const moment_1 = __importDefault(require("moment"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const constants_1 = require("./constants");
const parser = new rss_parser_1.default();
moment_1.default.locale('es');
const handlerGetVersion = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield (0, axios_1.default)(url);
    return new Promise((resolve) => {
        const $ = cheerio_1.default.load(file.data);
        resolve($(constants_1.REGEXPS.TAG_ELEMENT).eq(0).text());
    });
});
exports.handlerGetVersion = handlerGetVersion;
const handlerGetLatestArticles = () => __awaiter(void 0, void 0, void 0, function* () { return parser.parseURL(constants_1.URLS.RSS).then((data) => data.items); });
exports.handlerGetLatestArticles = handlerGetLatestArticles;
const handlerPrettyDate = (date) => (0, moment_1.default)(new Date(date)).format('LL');
exports.handlerPrettyDate = handlerPrettyDate;
const hanlderSliceArticles = (articles) => articles
    .slice(0, constants_1.NUMBERS.ARTICLES)
    .map(({ title, link, pubDate }) => pubDate
    ? `- [${title}](${link}) - <small>Publicado el ${(0, exports.handlerPrettyDate)(pubDate)}</small>`
    : `[${title}](${link})`)
    .join('\n');
exports.hanlderSliceArticles = hanlderSliceArticles;
const handlerGetInstagramImages = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { data } = yield axios_1.default.get(`https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={"id":${constants_1.PROSKYNETE},"first":${constants_1.NUMBERS.IMAGES},"after":null}`);
    const { edges } = (_c = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.edge_owner_to_timeline_media) !== null && _c !== void 0 ? _c : {};
    return (edges &&
        edges.map(({ node }) => {
            return {
                permalink: `https://www.instagram.com/p/${node.shortcode}/`,
                media_url: node.thumbnail_src,
                description: !lodash_1.default.isEmpty(node.edge_media_to_caption.edges)
                    ? node.edge_media_to_caption.edges[0].node.text
                    : '',
            };
        }));
});
exports.handlerGetInstagramImages = handlerGetInstagramImages;
const handlerGetLatestInstagramImages = (images) => images
    .slice(0, constants_1.NUMBERS.IMAGES)
    .map(({ media_url, permalink, description }) => `<a href='${permalink}' target='_blank'>
				<img
					src='${media_url}'
					alt=${description ? `"${description}"` : "'Instagram image'"}
					width='150'
					height='150'
				/>
    </a>`)
    .join('');
exports.handlerGetLatestInstagramImages = handlerGetLatestInstagramImages;
const handlerGetYearsOld = () => (0, moment_1.default)().diff(constants_1.YEAR_OF_BIRTH, 'years');
exports.handlerGetYearsOld = handlerGetYearsOld;
//# sourceMappingURL=handlers.js.map