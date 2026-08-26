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
			PROFILE: '%{{instagram_profile}}%',
		},
	},
	ADP_LIST: {
		COMMENTS: '%{{adp_list_comments}}%',
		COUNT_COMMENTS: '%{{number_comments}}%',
	},
	GITHUB: {
		REPOSITORIES: '%{{repositories}}%',
	},
};

export const REGEXPS: RegexpsInterface = {
	TAG_ELEMENT: 'p.f2874b88.fw6.mb3.mt2.truncate.black-80.f4',
};

export const COUNT: CountInterface = {
	ARTICLES: 5,
	IMAGES: 4,
	COMMENTS: 3,
	REPOSITORIES: 4,
};

export const BASE_URL: BaseUrlInterface = {
	NPM: 'https://www.npmjs.com/package',
	WEBSITE: 'https://eduardoalvarez.dev',
	TECHNOLOGIES: 'https://github.com/Proskynete/Proskynete/blob/main/images/icons',
	INSTAGRAM_API: 'https://rocketapi-for-developers.p.rapidapi.com/instagram/user/get_media',
	ADP_LIST: 'https://api2.adplist.org',
	GITHUB_API: 'https://api.github.com',
};

export const INSTAGRAM = {
	USER_ID: 41056689992, // 42938370
	USER_NAME: 'eduardo_alvarez.dev', // Proskynete
};

export const PERSONAL = {
	YEAR_OF_BIRTH: '1993-12-24',
	ADP_USER_ID: 983411,
	GITHUB_USER: 'Proskynete',
};

/**
 * Repos que se muestran destacados, en este orden.
 *
 * Es una lista curada y no «los más estrellados» a propósito: el orden lo
 * decides tú, y ordenar por estrellas dejaría subir cualquier fork o
 * experimento. La descripción, el lenguaje y las estrellas sí salen en vivo de
 * la API, así que el contenido no se queda viejo aunque la selección sea fija.
 */
export const FEATURED_REPOSITORIES: string[] = [
	'vertical-timeline-component-react',
	'pretty-rating-react',
	'node-api-skeleton',
	'cypress-cucumber-boilerplate',
];

export const URLS: UrlsInterface = {
	VERTICAL_TIMELINE: 'vertical-timeline-component-react',
	PRETTY_RATING: 'pretty-rating-react',
	RSS: `${BASE_URL.WEBSITE}/rss.xml`,
	ADP_LIST_COMMENTS: `${BASE_URL.ADP_LIST}/core/review/?user_id=${PERSONAL.ADP_USER_ID}`,
};
