import {
	NumbersInterface,
	PlaceholdersInteface,
	RegexpsInterface,
	UrlsInterface,
} from './interfaces';

export const BASE_NPM_URL: string = 'https://www.npmjs.com/package';
export const BASE_WEBSITE: string = 'https://eduardoalvarez.dev';
export const YEAR_OF_BIRTH: string = '1993-12-24';
export const PROSKYNETE: number = 42938370;

export const PLACEHOLDERS: PlaceholdersInteface = {
	PERSONAL: {
		YEARS_OLD: '%{{years_old}}%',
	},
	LIBRARIES: {
		VERTICAL_TIMELINE: '%{{vt_version}}%',
		PRETTY_RATING: '%{{pr_version}}%',
	},
	WEBSITE: {
		NUMBER_ARTICLES: '%{{number_articles}}%',
		RSS: '%{{articles}}%',
	},
	SOCIAL_MEDIA: {
		INSTAGRAM: {
			NUMBER_IMAGES: '%{{number_images}}%',
			SECTION_IMAGES: '%{{instagram_images}}%',
		},
	},
};

export const URLS: UrlsInterface = {
	VERTICAL_TIMELINE: `${BASE_NPM_URL}/vertical-timeline-component-react`,
	PRETTY_RATING: `${BASE_NPM_URL}/pretty-rating-react`,
	RSS: `${BASE_WEBSITE}/rss.xml`,
};

export const REGEXPS: RegexpsInterface = {
	TAG_ELEMENT: 'p.f2874b88.fw6.mb3.mt2.truncate.black-80.f4',
};

export const NUMBERS: NumbersInterface = {
	ARTICLES: 5,
	IMAGES: 4,
};
