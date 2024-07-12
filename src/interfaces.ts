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
	data: {
		user: {
			edge_owner_to_timeline_media: {
				edges: InstagramNodeInterface[];
			};
		};
	};
}

export interface ThumbnailInterface {
	src: string;
	config_width: number;
	config_height: number;
}

export interface EdgesInterface {
	node: {
		text: string;
	};
}

export type Captions = EdgesInterface;

export interface InstagramNodeInterface {
	node: {
		id: string;
		shortcode: string;
		post_url: string;
		display_url: string;
		thumbnail_src: string;
		thumbnail_resources: ThumbnailInterface[];
		accessibility_caption: string;
		edge_media_to_caption: {
			edges: Captions[];
		};
	};
}

export interface InstagramImagesResponse {
	code: string;
	url: string;
	accessibility: string;
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
