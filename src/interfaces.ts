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

export interface InstagramInterface {
	shortcode: string;
	dispay_url: string;
	thumbnail_resources: ThumbnailInterface[];
	thumbnail_src: string;
	edge_media_to_caption: {
		edges: EdgesInterface[];
	};
}

export interface InstagramNodeInterface {
	node: InstagramInterface;
}

export interface InstagramImagesResponse {
	permalink: string;
	media_url: [string, ThumbnailInterface];
	description: string;
}

export interface PlaceholdersInteface {
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

export interface UrlsInterface {
	VERTICAL_TIMELINE: string;
	PRETTY_RATING: string;
	RSS: string;
}

export interface RegexpsInterface {
	TAG_ELEMENT: string;
}

export interface NumbersInterface {
	ARTICLES: number;
	IMAGES: number;
}
