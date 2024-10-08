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
const promises_1 = __importDefault(require("fs/promises"));
const constants_1 = require("./constants");
const handlers_1 = require("./handlers");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [template, articles, images] = yield Promise.all([
            promises_1.default.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
            (0, handlers_1.handlerGetLatestArticles)(),
            (0, handlers_1.handlerGetInstagramImages)(),
        ]);
        const _verticalTimeline = yield (0, handlers_1.handlerGetPackageVersion)(constants_1.URLS.VERTICAL_TIMELINE);
        const _prettyRating = yield (0, handlers_1.handlerGetPackageVersion)(constants_1.URLS.PRETTY_RATING);
        const _comments = yield (0, handlers_1.handlerGetAdpListComments)(constants_1.URLS.ADP_LIST_COMMENTS);
        const _articles = articles ? (0, handlers_1.handlerSliceArticles)(articles) : '';
        const _images = images ? (0, handlers_1.handlerGetLatestInstagramImages)(images) : '';
        const _yearsOld = (0, handlers_1.handlerGetYearsOld)();
        const _technologies = (0, handlers_1.handleGetTechnologies)();
        const newMarkdown = template
            .replace(constants_1.PLACEHOLDERS.TECHNOLOGIES, _technologies)
            .replace(constants_1.PLACEHOLDERS.PERSONAL.YEARS_OLD, _yearsOld.toString())
            .replace(constants_1.PLACEHOLDERS.LIBRARIES.VERTICAL_TIMELINE, _verticalTimeline)
            .replace(constants_1.PLACEHOLDERS.LIBRARIES.PRETTY_RATING, _prettyRating)
            .replace(constants_1.PLACEHOLDERS.WEBSITE.NUMBER_ARTICLES, constants_1.COUNT.ARTICLES.toString())
            .replace(constants_1.PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.PROFILE, constants_1.INSTAGRAM.USER_NAME)
            .replace(constants_1.PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.NUMBER_IMAGES, constants_1.COUNT.IMAGES.toString())
            .replace(constants_1.PLACEHOLDERS.ADP_LIST.COUNT_COMMENTS, constants_1.COUNT.COMMENTS.toString())
            .replace(constants_1.PLACEHOLDERS.WEBSITE.RSS, _articles)
            .replace(constants_1.PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.SECTION_IMAGES, _images)
            .replace(constants_1.PLACEHOLDERS.ADP_LIST.COMMENTS, _comments);
        yield promises_1.default.writeFile('./README.md', newMarkdown);
        console.log('README.md has been generated!');
        process.exit(0);
    }
    catch (error) {
        console.error('An error occurred while generating the README.md file');
        console.error(error);
        process.exit(0);
    }
}))();
//# sourceMappingURL=index.js.map