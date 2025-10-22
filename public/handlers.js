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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const core = __importStar(require("@actions/core"));
const rss_parser_1 = __importDefault(require("rss-parser"));
const constants_1 = require("./constants");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const parser = new rss_parser_1.default();
const { INSTAGRAM_API_KEY } = process.env;
const clearLineBreak = (text) => text.replace(/<br\s*\/?>/gi, '');
const clearText = (text) => {
    const _text = text.replace(/<[^>]*>/g, '');
    return _text
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};
const handlerGetPackageVersion = (packageName) => __awaiter(void 0, void 0, void 0, function* () {
    const registryUrl = `https://registry.npmjs.org/${packageName}/latest`;
    console.log(`Fetching version for ${packageName}...`);
    const { data } = yield axios_1.default.get(registryUrl, {
        headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip,deflate,compress',
        },
    });
    return data.version;
});
exports.handlerGetPackageVersion = handlerGetPackageVersion;
const prettyDateFormat = (date) => new Date(date).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
exports.prettyDateFormat = prettyDateFormat;
const handlerGetAdpListComments = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield axios_1.default.get(url, {
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
    });
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
    const body = {
        id: constants_1.INSTAGRAM.USER_ID,
        count: constants_1.COUNT.IMAGES,
        max_id: null,
    };
    console.time('Instagram API');
    try {
        const { data } = yield axios_1.default.post(constants_1.BASE_URL.INSTAGRAM_API, body, {
            headers: {
                'x-rapidapi-host': 'rocketapi-for-developers.p.rapidapi.com',
                'x-rapidapi-key': INSTAGRAM_API_KEY,
                'Content-Type': 'application/json',
            },
        });
        return data.response.body.items.map(({ caption, code, image_versions2: { candidates }, product_type }) => {
            var _a;
            return ({
                code,
                url: candidates.length > 1 ? candidates[1].url : candidates[0].url,
                type: product_type,
                description: (_a = caption === null || caption === void 0 ? void 0 : caption.text) !== null && _a !== void 0 ? _a : '',
            });
        });
    }
    catch (err) {
        console.error(err);
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
    .map(({ url, code, description }) => `<a href='https://instagram.com/p/${code}' target='_blank'>
					<img
					src='${url}'
					alt='${clearText(clearLineBreak(description))}'
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