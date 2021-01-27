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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYearsOld = exports.latestInstagramImages = exports.getInstagramImages = exports.sliceArticles = exports.prettyDate = exports.getLatestArticles = exports.getVersion = void 0;
var axios_1 = __importDefault(require("axios"));
var cheerio_1 = __importDefault(require("cheerio"));
var rss_parser_1 = __importDefault(require("rss-parser"));
var moment_1 = __importDefault(require("moment"));
var constants_1 = require("./constants");
var parser = new rss_parser_1.default();
moment_1.default.locale('en');
/**
 * Get the version of a library published in npm.com
 * @param {GetVersionInterface} url - Url to check.
 * @returns All results according to search.
 */
var getVersion = function (url) { return __awaiter(void 0, void 0, void 0, function () {
    var file;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default(url)];
            case 1:
                file = _a.sent();
                return [2 /*return*/, new Promise(function (resolve) {
                        var $ = cheerio_1.default.load(file.data);
                        resolve($(constants_1.REGEXPS.TAG_ELEMENT).eq(0).text());
                    })];
        }
    });
}); };
exports.getVersion = getVersion;
/**
 * Get all articles from some RSS page.
 * @returns All items found.
 */
var getLatestArticles = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, parser.parseURL(constants_1.URLS.RSS).then(function (data) { return data.items; })];
}); }); };
exports.getLatestArticles = getLatestArticles;
/**
 * Transform the date that we pass to a LL format (moment reference).
 * @param {string} date - Any format of date.
 * @returns format example: MM DD, YYYY
 */
var prettyDate = function (date) {
    return moment_1.default(new Date(date)).format('LL');
};
exports.prettyDate = prettyDate;
/**
 * Get an array of articles and transform them with a markdown format.
 * @param {array} articles - Articles obtained from an RSS.
 * @returns Link with the title, and the date of the post, with markdown syntax.
 */
var sliceArticles = function (articles) {
    return articles
        .slice(0, constants_1.NUMBERS.ARTICLES)
        .map(function (_a) {
        var title = _a.title, link = _a.link, pubDate = _a.pubDate;
        return pubDate
            ? "[" + title + "](" + link + ") - <small>Posted on " + exports.prettyDate(pubDate) + "</small>"
            : "[" + title + "](" + link + ")";
    })
        .join('\n');
};
exports.sliceArticles = sliceArticles;
/**
 * Get images from any instagram profile
 * @returns A object with permalink and media_url attributes
 */
var getInstagramImages = function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, edges;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.get("https://www.instagram.com/graphql/query?query_id=17888483320059182&variables={\"id\":" + constants_1.PROSKYNETE + ",\"first\":" + constants_1.NUMBERS.IMAGES + ",\"after\":null}")];
            case 1:
                data = (_a.sent()).data;
                edges = data.data.user.edge_owner_to_timeline_media.edges;
                return [2 /*return*/, edges.map(function (_a) {
                        var node = _a.node;
                        return ({
                            permalink: "https://www.instagram.com/p/" + node.shortcode + "/",
                            media_url: [node.thumbnail_src, node.thumbnail_resources[0]],
                            description: node.edge_media_to_caption.edges[0].node.text,
                        });
                    })];
        }
    });
}); };
exports.getInstagramImages = getInstagramImages;
/**
 * Trasnform the string of images to mdx format and slice the result
 * @param {InstagramImagesResponse[]} images - Array of { permalink, media_url } attributes
 * @returns An array of links wirth images obtained from instagram
 */
var latestInstagramImages = function (images) {
    return images
        .slice(0, constants_1.NUMBERS.IMAGES)
        .map(function (_a) {
        var media_url = _a.media_url, permalink = _a.permalink, description = _a.description;
        return "<a href='" + permalink + "' target='_blank'>\n\t\t\t\t<img\n\t\t\t\t\tsrc='" + media_url[0] + "'\n\t\t\t\t\talt='" + description + "'\n\t\t\t\t\twidth='" + media_url[1].config_width + "'\n\t\t\t\t\theight='" + media_url[1].config_height + "'\n\t\t\t\t/>\n    </a>";
    })
        .join('');
};
exports.latestInstagramImages = latestInstagramImages;
/**
 * Get the number of years from the year of birth to now
 * @returns Number of years
 */
var getYearsOld = function () { return moment_1.default().diff(constants_1.YEAR_OF_BIRTH, 'years'); };
exports.getYearsOld = getYearsOld;
//# sourceMappingURL=functions.js.map