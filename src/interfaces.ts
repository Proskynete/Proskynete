export interface Article {
	title: string;
	link: string;
	pubDate: string;
}

type OVERALL_EXPERIENCE = 'Exceeds expectations' | 'Meets expectations' | 'Needs improvement';
type RELEVANT_KEYWORDS =
	| 'Technically competent'
	| 'Amazing problem solver'
	| 'Very motivational'
	| 'Great communicator'
	| 'Positive attitude'
	| 'Tactful'
	| 'Approachable'
	| 'Professional';

type ContentType = 'feed' | 'carousel_container' | 'clips';

interface RelevantKeywords {
	id: number;
	description: string | null;
	keyword: RELEVANT_KEYWORDS;
}

export interface GetCommentFromADPListResponse {
	id: number;
	review: string;
	date_reviewed: string;
	overall_experience: OVERALL_EXPERIENCE;
	relevant_keywords: RelevantKeywords[];
	reviewed_by: {
		name: string;
		slug: string;
		identity_type: string;
		employer: string;
	};
}

export interface InstagramApiResponse {
	response: {
		body: {
			items: Item[];
		};
	};
}

export interface Item {
	code: string;
	caption: {
		content_type: string;
		text: string;
	} | null;
	image_versions2: {
		candidates: Candidates[];
	};
	product_type: ContentType;
}

export interface Candidates {
	estimated_scans_sizes: number[];
	scans_profile: string;
	height: number;
	width: number;
	url: string;
}

export interface InstagramImagesResponse {
	url: string;
	code: string;
	type: string;
	description: string;
}

export interface ImagesInterface {
	file_name: string;
	technology: string;
}

export interface PlaceholdersInterface {
	TECHNOLOGIES: string;
	PERSONAL: {
		YEARS_OLD: string;
	};
	LIBRARIES: {
		VERTICAL_TIMELINE: string;
		PRETTY_RATING: string;
	};
	WEBSITE: {
		NUMBER_ARTICLES: string;
		RSS: string;
	};
	SOCIAL_MEDIA: {
		INSTAGRAM: {
			NUMBER_IMAGES: string;
			SECTION_IMAGES: string;
			PROFILE: string;
		};
	};
	ADP_LIST: {
		COMMENTS: string;
		COUNT_COMMENTS: string;
	};
}

export interface BaseUrlInterface {
	NPM: string;
	WEBSITE: string;
	TECHNOLOGIES: string;
	INSTAGRAM_API: string;
	ADP_LIST: string;
}

export interface UrlsInterface {
	VERTICAL_TIMELINE: string;
	PRETTY_RATING: string;
	RSS: string;
	ADP_LIST_COMMENTS: string;
}

export interface RegexpsInterface {
	TAG_ELEMENT: string;
}

export interface CountInterface {
	ARTICLES: number;
	IMAGES: number;
	COMMENTS: number;
}
