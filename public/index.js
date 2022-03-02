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
const fs_1 = require("fs");
const prettier_1 = __importDefault(require("prettier"));
const constants_1 = require("./constants");
const handlers_1 = require("./handlers");
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prettierConfig = yield prettier_1.default.resolveConfig('../.pretierrc');
        const [template, articles, images] = yield Promise.all([
            fs_1.promises.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
            (0, handlers_1.handlerGetLatestArticles)(),
            (0, handlers_1.handlerGetInstagramImages)(),
        ]);
        const _verticalTimeline = yield (0, handlers_1.handlerGetVersion)(constants_1.URLS.VERTICAL_TIMELINE);
        const _prettyRating = yield (0, handlers_1.handlerGetVersion)(constants_1.URLS.PRETTY_RATING);
        const _articles = articles ? (0, handlers_1.handlerSliceArticles)(articles) : '';
        const _images = images ? (0, handlers_1.handlerGetLatestInstagramImages)(images) : '';
        const _yearsOld = (0, handlers_1.handlerGetYearsOld)();
        const newMarkdown = template
            .replace(constants_1.PLACEHOLDERS.PERSONAL.YEARS_OLD, _yearsOld.toString())
            .replace(constants_1.PLACEHOLDERS.LIBRARIES.VERTICAL_TIMELINE, _verticalTimeline)
            .replace(constants_1.PLACEHOLDERS.LIBRARIES.PRETTY_RATING, _prettyRating)
            .replace(constants_1.PLACEHOLDERS.WEBSITE.NUMBER_ARTICLES, constants_1.NUMBERS.ARTICLES.toString())
            .replace(constants_1.PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.NUMBER_IMAGES, constants_1.NUMBERS.IMAGES.toString())
            .replace(constants_1.PLACEHOLDERS.WEBSITE.RSS, _articles)
            .replace(constants_1.PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.SECTION_IMAGES, _images);
        const markdownFormated = prettier_1.default.format(newMarkdown, Object.assign(Object.assign({}, prettierConfig), { parser: 'mdx' }));
        yield fs_1.promises.writeFile('./README.md', markdownFormated);
    }
    catch (error) {
        console.error(error);
    }
}))();
//# sourceMappingURL=index.js.map