"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.handleGetTechnologies = exports.handlerGetYearsOld = exports.handlerGetLatestInstagramImages = exports.handlerGetInstagramImages = exports.handlerSliceArticles = exports.handlerGetLatestArticles = exports.handlerGetAdpListComments = exports.prettyDateFormat = exports.handlerGetPackageVersion = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const core = __importStar(require("@actions/core"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const constants_1 = require("./constants");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const parser = new rss_parser_1.default();
const { INSTAGRAM_API_KEY } = process.env;
const handlerGetPackageVersion = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield (0, axios_1.default)(url);
    return new Promise((resolve) => {
        const $ = cheerio.load(file.data);
        resolve($(constants_1.REGEXPS.TAG_ELEMENT).eq(0).text());
    });
});
exports.handlerGetPackageVersion = handlerGetPackageVersion;
const prettyDateFormat = (date) => new Date(date).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
exports.prettyDateFormat = prettyDateFormat;
const handlerGetAdpListComments = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, axios_1.default)(url);
    return data
        .slice(0, constants_1.COUNT.COMMENTS)
        .map(({ review, reviewed_by, date_reviewed }) => `<li><i>"${review}"</i> - ${reviewed_by.name} <small>(${(0, exports.prettyDateFormat)(date_reviewed)})</small></li>`)
        .join('\n');
});
exports.handlerGetAdpListComments = handlerGetAdpListComments;
const handlerGetLatestArticles = () => __awaiter(void 0, void 0, void 0, function* () { return parser.parseURL(constants_1.URLS.RSS).then((data) => data.items); });
exports.handlerGetLatestArticles = handlerGetLatestArticles;
const handlerSliceArticles = (articles) => articles
    .slice(0, constants_1.COUNT.ARTICLES)
    .map(({ title, link, pubDate }) => (pubDate ? `- [${title}](${link})` : `[${title}](${link})`))
    .join('\n');
exports.handlerSliceArticles = handlerSliceArticles;
const handlerGetInstagramImages = () => __awaiter(void 0, void 0, void 0, function* () {
    console.time('Instagram API');
    try {
        const { data } = yield axios_1.default.get(constants_1.BASE_URL.INSTAGRAM_API, {
            params: {
                user: constants_1.INSTAGRAM.USER_NAME,
                nocors: 'false',
            },
            headers: {
                'X-RapidAPI-Host': 'instagram-scraper-2022.p.rapidapi.com',
                'X-RapidAPI-Key': INSTAGRAM_API_KEY,
            },
        });
        return data.items.map((image) => {
            var _a, _b, _c, _d, _e;
            return ({
                code: (_a = image.code) !== null && _a !== void 0 ? _a : '',
                url: (_b = image.image_versions2.candidates[9].url) !== null && _b !== void 0 ? _b : '',
                accessibility: (_c = image.accessibility_caption) !== null && _c !== void 0 ? _c : '',
                type: image.product_type,
                description: (_e = (_d = image.caption) === null || _d === void 0 ? void 0 : _d.text) !== null && _e !== void 0 ? _e : '',
            });
        });
    }
    catch (err) {
        if (axios_1.default.isAxiosError(err)) {
            const { response } = err;
            if (response)
                core.setFailed(err.message);
            process.exit(1);
        }
    }
    console.timeEnd('Instagram API');
});
exports.handlerGetInstagramImages = handlerGetInstagramImages;
const handlerGetLatestInstagramImages = (images) => images
    .slice(0, constants_1.COUNT.IMAGES)
    .map(({ code, url, accessibility, type, description }) => type === 'clips'
    ? `[![${accessibility !== null && accessibility !== void 0 ? accessibility : description}](https://instagram.com/p/${code})](${url})`
    : `<a href='https://instagram.com/p/${code}' target='_blank'>
				<img
					src='${url}'
					alt='${accessibility !== null && accessibility !== void 0 ? accessibility : description}'
					width='180'
					height='180'
				/>
    </a>`)
    .join('');
exports.handlerGetLatestInstagramImages = handlerGetLatestInstagramImages;
const handlerGetYearsOld = () => dateDifferenceInYears(new Date(constants_1.PERSONAL.YEAR_OF_BIRTH), new Date());
exports.handlerGetYearsOld = handlerGetYearsOld;
const dateDifferenceInMonths = (dateInitial, dateFinal) => Math.max((dateFinal.getFullYear() - dateInitial.getFullYear()) * 12 +
    dateFinal.getMonth() -
    dateInitial.getMonth(), 0);
const dateDifferenceInYears = (dateInitial, dateFinal) => Math.trunc(dateDifferenceInMonths(dateInitial, dateFinal) / 12);
const handleGetTechnologies = () => {
    const _array = [
        { file_name: 'ts', technology: 'Typescript' },
        { file_name: 'js', technology: 'Javascript' },
        { file_name: 'react', technology: 'React' },
        { file_name: 'vue', technology: 'Vue' },
        { file_name: 'svelte', technology: 'Svelte' },
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