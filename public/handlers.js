"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.handleGetTechnologies = exports.handlerGetYearsOld = exports.handlerGetLatestInstagramImages = exports.handlerGetInstagramImages = exports.handlerSliceArticles = exports.handlerPrettyDate = exports.handlerGetLatestArticles = exports.handlerGetVersion = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const moment_1 = __importDefault(require("moment"));
const core = __importStar(require("@actions/core"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const constants_1 = require("./constants");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const parser = new rss_parser_1.default();
moment_1.default.locale('es');
const { INSTAGRAM_API_KEY } = process.env;
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
const handlerSliceArticles = (articles) => articles
    .slice(0, constants_1.COUNT.ARTICLES)
    .map(({ title, link, pubDate }) => (pubDate ? `- [${title}](${link})` : `[${title}](${link})`))
    .join('\n');
exports.handlerSliceArticles = handlerSliceArticles;
const handlerGetInstagramImages = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { data } = yield axios_1.default.get(constants_1.BASE_URL.INSTAGRAM_API, {
            timeout: 20000,
            params: {
                user: constants_1.INSTAGRAM.USER_NAME,
            },
            headers: {
                'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com',
                'X-RapidAPI-Key': INSTAGRAM_API_KEY,
            },
        });
        const images = (_c = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.edge_owner_to_timeline_media) === null || _c === void 0 ? void 0 : _c.edges;
        return (images &&
            images.map((image) => ({
                shortcode: image.node.shortcode,
                url: image.node.thumbnail_src,
                accessibility: image.node.accessibility_caption,
                description: image.node.edge_media_to_caption.edges.length
                    ? image.node.edge_media_to_caption.edges[0].node.text
                        .replace(/(\r\n|\n|\r)/gm, ' ')
                        .trim()
                    : '',
            })));
    }
    catch (err) {
        if (axios_1.default.isAxiosError(err)) {
            const { response } = err;
            if (response) {
                core.setFailed(err.message);
            }
        }
    }
});
exports.handlerGetInstagramImages = handlerGetInstagramImages;
const handlerGetLatestInstagramImages = (images) => images
    .slice(0, constants_1.COUNT.IMAGES)
    .map(({ shortcode, url, accessibility, description, }) => `<a href='https://instagram.com/p/${shortcode}' target='_blank'>
				<img
					src='${url}'
					alt='${accessibility !== null && accessibility !== void 0 ? accessibility : description}'
					width='150'
					height='150'
				/>
    </a>`)
    .join('');
exports.handlerGetLatestInstagramImages = handlerGetLatestInstagramImages;
const handlerGetYearsOld = () => (0, moment_1.default)().diff(constants_1.PERSONAL.YEAR_OF_BIRTH, 'years');
exports.handlerGetYearsOld = handlerGetYearsOld;
const handleGetTechnologies = () => {
    const _array = [
        { file_name: 'ts', technology: 'Typescript' },
        { file_name: 'js', technology: 'Javascript' },
        { file_name: 'react', technology: 'React' },
        { file_name: 'redux', technology: 'Redux' },
        { file_name: 'html5', technology: 'HTML5' },
        { file_name: 'css3', technology: 'CSS3' },
        { file_name: 'node', technology: 'Nodejs' },
        { file_name: 'mongodb', technology: 'MongoDB' },
        { file_name: 'dart', technology: 'Dart' },
        { file_name: 'flutter', technology: 'Flutter' },
        { file_name: 'aws', technology: 'Amazon Web Services' },
        { file_name: 'git', technology: 'Git' },
        { file_name: 'firebase', technology: 'Firebase' },
    ];
    return _array
        .map(({ file_name, technology }) => `<img
					src='${constants_1.BASE_URL.TECHNOLOGIES}/${file_name}.png?raw=true'
					alt=${technology}
					width='25'
					height='25'
				/>`)
        .join(' ');
};
exports.handleGetTechnologies = handleGetTechnologies;
//# sourceMappingURL=handlers.js.map