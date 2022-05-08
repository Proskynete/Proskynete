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
exports.handleGetTechnologies = exports.handlerGetYearsOld = exports.handlerGetLatestInstagramImages = exports.handlerGetInstagramImages = exports.handlerSliceArticles = exports.handlerPrettyDate = exports.handlerGetLatestArticles = exports.handlerGetVersion = void 0;
const lodash_1 = __importDefault(require("lodash"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const moment_1 = __importDefault(require("moment"));
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
    .slice(0, constants_1.NUMBERS.ARTICLES)
    .map(({ title, link, pubDate }) => (pubDate ? `- [${title}](${link})` : `[${title}](${link})`))
    .join('\n');
exports.handlerSliceArticles = handlerSliceArticles;
const handlerGetInstagramImages = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { data } = yield axios_1.default.get(`https://instagram85.p.rapidapi.com/account/${constants_1.INSTAGRAM_USERNAME}/info`, {
            headers: {
                'X-Rapidapi-Host': 'instagram85.p.rapidapi.com',
                'X-Rapidapi-Key': INSTAGRAM_API_KEY,
                'X-Access-Token': INSTAGRAM_API_KEY,
            },
        });
        const images = data.data.feed.data;
        return (images &&
            images.map((image) => {
                return {
                    type: image.type,
                    permalink: image.post_url,
                    media_url: image.images.thumbnail,
                    description: !lodash_1.default.isEmpty(image.caption)
                        ? image.caption.replace(/(\r\n|\n|\r)/gm, ' ').trim()
                        : '',
                };
            }));
    }
    catch (err) {
        console.error(err);
        throw new Error();
    }
});
exports.handlerGetInstagramImages = handlerGetInstagramImages;
const handlerGetLatestInstagramImages = (images) => images
    .slice(0, constants_1.NUMBERS.IMAGES)
    .map(({ media_url, permalink, description, type }) => `<a href='${permalink}' target='_blank'>
				<img
					src='${media_url}'
					alt=${description
    ? `"${description}"`
    : type === 'video'
        ? "'Instagram video'"
        : "'Instagram image'"}
					width='150px'
					height='150px'
				/>
    </a>`)
    .join('');
exports.handlerGetLatestInstagramImages = handlerGetLatestInstagramImages;
const handlerGetYearsOld = () => (0, moment_1.default)().diff(constants_1.YEAR_OF_BIRTH, 'years');
exports.handlerGetYearsOld = handlerGetYearsOld;
const handleGetTechnologies = () => {
    const _array = [
        { file_name: 'ts', technology: 'Typescript' },
        { file_name: 'js', technology: 'Javascript' },
        { file_name: 'html5', technology: 'HTML5' },
        { file_name: 'css3', technology: 'CSS3' },
        { file_name: 'bootstrap', technology: 'Bootstrap' },
        { file_name: 'sass', technology: 'Sass' },
        { file_name: 'react', technology: 'React' },
        { file_name: 'redux', technology: 'Redux' },
        { file_name: 'node', technology: 'Nodejs' },
        { file_name: 'mongodb', technology: 'MongoDB' },
        { file_name: 'dart', technology: 'Dart' },
        { file_name: 'flutter', technology: 'Flutter' },
        { file_name: 'aws', technology: 'Amazon Web Services' },
        { file_name: 'gcp', technology: 'Google Cloud Platform' },
        { file_name: 'git', technology: 'Git' },
    ];
    return _array
        .map(({ file_name, technology }) => `<img
					src='${constants_1.BASE_URL_TECHNOLOGIES}/${file_name}.png?raw=true'
					alt=${technology}
					width='25'
					height='25'
				/>`)
        .join(' ');
};
exports.handleGetTechnologies = handleGetTechnologies;
//# sourceMappingURL=handlers.js.map