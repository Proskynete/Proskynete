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
exports.handleGetTechnologies = exports.handlerGetYearsOld = exports.handlerRenderFeaturedRepositories = exports.handlerGetFeaturedRepositories = exports.handlerGetLatestInstagramImages = exports.handlerGetInstagramImages = exports.handlerSliceArticles = exports.handlerGetLatestArticles = exports.handlerGetAdpListComments = exports.prettyDateFormat = exports.handlerGetPackageVersion = exports.failures = void 0;
const axios_1 = __importDefault(require("axios"));
const fast_xml_parser_1 = require("fast-xml-parser");
const constants_1 = require("./constants");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { INSTAGRAM_API_KEY, GITHUB_TOKEN } = process.env;
exports.failures = [];
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
const handlerGetLatestArticles = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { data } = yield axios_1.default.get(constants_1.URLS.RSS, {
        responseType: 'text',
        headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
    });
    const feed = new fast_xml_parser_1.XMLParser().parse(data);
    const items = (_c = (_b = (_a = feed === null || feed === void 0 ? void 0 : feed.rss) === null || _a === void 0 ? void 0 : _a.channel) === null || _b === void 0 ? void 0 : _b.item) !== null && _c !== void 0 ? _c : [];
    return (Array.isArray(items) ? items : [items]).map(({ title, link, pubDate }) => ({
        title,
        link,
        pubDate,
    }));
});
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
        const message = axios_1.default.isAxiosError(err) ? err.message : String(err);
        console.error(`::error::Instagram: ${message}`);
        exports.failures.push('instagram');
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
const handlerGetFeaturedRepositories = () => __awaiter(void 0, void 0, void 0, function* () {
    const headers = { Accept: 'application/vnd.github+json' };
    if (GITHUB_TOKEN)
        headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    const results = yield Promise.allSettled(constants_1.FEATURED_REPOSITORIES.slice(0, constants_1.COUNT.REPOSITORIES).map((name) => axios_1.default.get(`${constants_1.BASE_URL.GITHUB_API}/repos/${constants_1.PERSONAL.GITHUB_USER}/${name}`, { headers })));
    return results
        .filter((r) => r.status === 'fulfilled')
        .map(({ value: { data } }) => {
        var _a, _b;
        return ({
            name: data.name,
            url: data.html_url,
            description: (_a = data.description) !== null && _a !== void 0 ? _a : '',
            language: (_b = data.language) !== null && _b !== void 0 ? _b : '',
            stars: data.stargazers_count,
        });
    });
});
exports.handlerGetFeaturedRepositories = handlerGetFeaturedRepositories;
const handlerRenderFeaturedRepositories = (repositories) => {
    if (!repositories.length)
        return '';
    return repositories
        .map(({ name, url, description, language, stars }) => {
        const meta = [language, stars > 0 ? `⭐ ${stars}` : ''].filter(Boolean).join(' · ');
        const suffix = meta ? ` <small>${meta}</small>` : '';
        const summary = description ? `<br /><small>${description}</small>` : '';
        return `  <li><a href="${url}" target="_blank"><strong>${name}</strong></a>${suffix}${summary}</li>`;
    })
        .join('\n');
};
exports.handlerRenderFeaturedRepositories = handlerRenderFeaturedRepositories;
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