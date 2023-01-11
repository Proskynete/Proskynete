export interface Article {
	title: string;
	link: string;
	pubDate: string;
}

export interface InstagramApiResponse {
	edges: InstagramNodeInterface[];
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
	shortcode: string;
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
		};
	};
}

export interface BaseUrlInterface {
	NPM: string;
	WEBSITE: string;
	TECHNOLOGIES: string;
	INSTAGRAM_API: string;
}

export interface UrlsInterface {
	VERTICAL_TIMELINE: string;
	PRETTY_RATING: string;
	RSS: string;
}

export interface RegexpsInterface {
	TAG_ELEMENT: string;
}

export interface CountInterface {
	ARTICLES: number;
	IMAGES: number;
}
