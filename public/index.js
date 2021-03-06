"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var fs_1 = require("fs");
var prettier_1 = __importDefault(require("prettier"));
var constants_1 = require("./constants");
var handlers_1 = require("./handlers");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var prettierConfig, _a, template, articles, images, _verticalTimeline, _prettyRating, _articles, _images, _yearsOld, newMarkdown, markdownFormated, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                return [4 /*yield*/, prettier_1.default.resolveConfig('../.pretierrc')];
            case 1:
                prettierConfig = _b.sent();
                return [4 /*yield*/, Promise.all([
                        fs_1.promises.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
                        handlers_1.handlerGetLatestArticles(),
                        handlers_1.handlerGetInstagramImages(),
                    ])];
            case 2:
                _a = _b.sent(), template = _a[0], articles = _a[1], images = _a[2];
                return [4 /*yield*/, handlers_1.handlerGetVersion(constants_1.URLS.VERTICAL_TIMELINE)];
            case 3:
                _verticalTimeline = _b.sent();
                return [4 /*yield*/, handlers_1.handlerGetVersion(constants_1.URLS.PRETTY_RATING)];
            case 4:
                _prettyRating = _b.sent();
                _articles = articles ? handlers_1.hanlderSliceArticles(articles) : '';
                _images = images ? handlers_1.handlerGetLatestInstagramImages(images) : '';
                _yearsOld = handlers_1.handlerGetYearsOld();
                newMarkdown = template
                    .replace(constants_1.PLACEHOLDERS.PERSONAL.YEARS_OLD, _yearsOld.toString())
                    .replace(constants_1.PLACEHOLDERS.LIBRARIES.VERTICAL_TIMELINE, _verticalTimeline)
                    .replace(constants_1.PLACEHOLDERS.LIBRARIES.PRETTY_RATING, _prettyRating)
                    .replace(constants_1.PLACEHOLDERS.WEBSITE.NUMBER_ARTICLES, constants_1.NUMBERS.ARTICLES.toString())
                    .replace(constants_1.PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.NUMBER_IMAGES, constants_1.NUMBERS.IMAGES.toString())
                    .replace(constants_1.PLACEHOLDERS.WEBSITE.RSS, _articles)
                    .replace(constants_1.PLACEHOLDERS.SOCIAL_MEDIA.INSTAGRAM.SECTION_IMAGES, _images);
                markdownFormated = prettier_1.default.format(newMarkdown, __assign(__assign({}, prettierConfig), { parser: 'mdx' }));
                return [4 /*yield*/, fs_1.promises.writeFile('./README.md', markdownFormated)];
            case 5:
                _b.sent();
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.error(error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); })();
