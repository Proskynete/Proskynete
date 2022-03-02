export interface Article {
	title: string;
	link: string;
	pubDate: string;
}

export interface InstagramApiResponse {
	data: {
		full_name: string;
		profile_pic: {
			normal: string;
			hd: string;
		};
		biography: string;
		website: string;
		feed: {
			data: InstagramNodeInterface[];
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

export interface InstagramNodeInterface {
	id: string;
	short_code: string;
	type: string;
	post_url: string;
	images: {
		thumbnail: string;
		original: {
			low: string;
			standard: string;
			high: string;
		};
		square: string[];
	};
	caption: string;
}

export interface InstagramImagesResponse {
	permalink: string;
	media_url: string;
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
