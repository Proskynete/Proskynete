export interface InstagramInterface {
  shortcode: string;
  thumbnail_src: string;
}


export interface InstagramNodeInterface {
  node: InstagramInterface;
}

export interface InstagramImagesResponse {
  permalink: string;
  media_url: string;
}