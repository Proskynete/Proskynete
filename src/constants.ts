import {
	BaseUrlInterface,
	CountInterface,
	PlaceholdersInterface,
	RegexpsInterface,
	UrlsInterface,
} from './interfaces';

export const PLACEHOLDERS: PlaceholdersInterface = {
	TECHNOLOGIES: '%{{technologies}}%',
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

export const REGEXPS: RegexpsInterface = {
	TAG_ELEMENT: 'p.f2874b88.fw6.mb3.mt2.truncate.black-80.f4',
};

export const COUNT: CountInterface = {
	ARTICLES: 5,
	IMAGES: 5,
};

export const BASE_URL: BaseUrlInterface = {
	NPM: 'https://www.npmjs.com/package',
	WEBSITE: 'https://eduardoalvarez.dev',
	TECHNOLOGIES: 'https://github.com/Proskynete/Proskynete/blob/main/images/icons',
	INSTAGRAM_API: 'https://instagram-scraper-2022.p.rapidapi.com/ig/posts/',
};

export const URLS: UrlsInterface = {
	VERTICAL_TIMELINE: `${BASE_URL.NPM}/vertical-timeline-component-react`,
	PRETTY_RATING: `${BASE_URL.NPM}/pretty-rating-react`,
	RSS: `${BASE_URL.WEBSITE}/rss.xml`,
};

export const INSTAGRAM = {
	USER_ID: 42938370,
	USER_NAME: 'Proskynete',
};

export const PERSONAL = {
	YEAR_OF_BIRTH: '1993-12-24',
};
