import axios, { AxiosError, AxiosResponse } from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { URLS, COUNT, PERSONAL, INSTAGRAM, BASE_URL, FEATURED_REPOSITORIES } from './constants';
import {
	Article,
	FeaturedRepository,
	GetCommentFromADPListResponse,
	GitHubRepositoryResponse,
	ImagesInterface,
	InstagramApiResponse,
	InstagramImagesResponse,
	Item,
} from './interfaces';
import dotenv from 'dotenv';

dotenv.config();

const { INSTAGRAM_API_KEY, GITHUB_TOKEN } = process.env;

/**
 * Data sources that failed during this run. The README is written regardless, so
 * one dead endpoint never blocks the rest, but the process still exits non-zero
 * so CI reports it instead of going quietly green with a section missing.
 */
export const failures: string[] = [];

const clearLineBreak = (text: string): string => text.replace(/<br\s*\/?>/gi, '');

const clearText = (text: string): string => {
	const _text = text.replace(/<[^>]*>/g, '');
	return _text
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
};

/**
 * It takes a package name as an argument, fetches the package metadata from npm registry,
 * and returns the latest version number
 * @param {string} packageName - The name of the npm package.
 * @returns The version of the package.
 */
export const handlerGetPackageVersion = async (packageName: string): Promise<string> => {
	const registryUrl = `https://registry.npmjs.org/${packageName}/latest`;

	console.log(`Fetching version for ${packageName}...`);

	const { data } = await axios.get(registryUrl, {
		headers: {
			Accept: 'application/json',
			'Accept-Encoding': 'gzip,deflate,compress',
		},
	});

	return data.version;
};

export const prettyDateFormat = (date: string): string =>
	new Date(date).toLocaleDateString('es-CL', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});

export const handlerGetAdpListComments = async (url: string) => {
	const { data } = await axios.get<GetCommentFromADPListResponse[]>(url, {
		headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
	});

	return data
		.slice(0, COUNT.COMMENTS)
		.map(
			({ review, reviewed_by, date_reviewed }) =>
				`<li><i>"${review}"</i> - ${reviewed_by.name} <small>(${prettyDateFormat(
					date_reviewed,
				)})</small></li>`,
		)
		.join('\n');
};

/**
 * It fetches the RSS feed from the URL, parses it, and returns the items
 */
export const handlerGetLatestArticles = async (): Promise<Article[]> => {
	const { data } = await axios.get<string>(URLS.RSS, {
		responseType: 'text',
		headers: { 'Accept-Encoding': 'gzip,deflate,compress' },
	});

	const feed = new XMLParser().parse(data);
	const items = feed?.rss?.channel?.item ?? [];

	return (Array.isArray(items) ? items : [items]).map(({ title, link, pubDate }: Article) => ({
		title,
		link,
		pubDate,
	}));
};

/**
 * It takes an array of articles, slices it to the first 5 articles, and then maps
 * each article to a markdown link
 * @param {Article[]} articles - Article[] - the array of articles to be sliced
 */
export const handlerSliceArticles = (articles: Article[]): string =>
	articles
		.slice(0, COUNT.ARTICLES)
		.map(({ title, link, pubDate }) => (pubDate ? `- [${title}](${link})` : `[${title}](${link})`))
		.join('\n');

/**
 * It makes a request to the Instagram API, gets the data, and returns an array of
 * objects with the data we need
 * @returns An array of InstagramImagesResponse objects.
 */
export const handlerGetInstagramImages = async (): Promise<InstagramImagesResponse[] | void> => {
	const body = {
		id: INSTAGRAM.USER_ID,
		count: COUNT.IMAGES,
		max_id: null,
	};
	console.time('Instagram API');
	try {
		const { data } = await axios.post<InstagramApiResponse>(BASE_URL.INSTAGRAM_API, body, {
			headers: {
				'x-rapidapi-host': 'rocketapi-for-developers.p.rapidapi.com',
				'x-rapidapi-key': INSTAGRAM_API_KEY,
				'Content-Type': 'application/json',
			},
		});

		return data.response.body.items.map(
			({ caption, code, image_versions2: { candidates }, product_type }: Item) => ({
				code,
				url: candidates.length > 1 ? candidates[1].url : candidates[0].url,
				type: product_type,
				description: caption?.text ?? '',
			}),
		);
	} catch (err) {
		// Deliberately does NOT exit the process. A lapsed API subscription used
		// to take down the whole README — articles, reviews and repositories
		// included — because this handler killed the run before anything was
		// written. Now the section degrades to empty and the rest still renders.
		// The ::error:: annotation keeps it visible in Actions, and index.ts
		// exits non-zero at the end so the run is still reported as failed.
		const message = axios.isAxiosError(err) ? (err as AxiosError).message : String(err);
		console.error(`::error::Instagram: ${message}`);
		failures.push('instagram');
	}
	console.timeEnd('Instagram API');
};

/**
 * It takes an array of Instagram images, slices it to the first 10 images, and
 * returns a string of HTML image tags
 * @param {InstagramImagesResponse[]} images - InstagramImagesResponse[] - this is
 * the response from the Instagram API.
 */
export const handlerGetLatestInstagramImages = (images: InstagramImagesResponse[]): string =>
	images
		.slice(0, COUNT.IMAGES)
		.map(
			({ url, code, description }) =>
				`<a href='https://instagram.com/p/${code}' target='_blank'>
					<img
					src='${url}'
					alt='${clearText(clearLineBreak(description))}'
					width='180'
					height='180'
				/>
    </a>`,
		)
		.join('');

/**
 * Fetches the live metadata for the curated featured repositories.
 *
 * The selection lives in FEATURED_REPOSITORIES; only the description, language
 * and star count come from the API, so the list stays yours while the numbers
 * stay fresh.
 *
 * Unauthenticated calls are capped at 60 per hour per IP, which is plenty for a
 * handful of repos. GITHUB_TOKEN raises that and is available for free inside
 * GitHub Actions, so it is used when present and ignored when not.
 *
 * A repo that fails to resolve is dropped rather than failing the whole README:
 * a renamed or archived repo should not cost you the entire profile.
 */
export const handlerGetFeaturedRepositories = async (): Promise<FeaturedRepository[]> => {
	const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
	if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

	const results = await Promise.allSettled(
		FEATURED_REPOSITORIES.slice(0, COUNT.REPOSITORIES).map((name) =>
			axios.get<GitHubRepositoryResponse>(
				`${BASE_URL.GITHUB_API}/repos/${PERSONAL.GITHUB_USER}/${name}`,
				{ headers },
			),
		),
	);

	return results
		.filter(
			(r): r is PromiseFulfilledResult<AxiosResponse<GitHubRepositoryResponse>> =>
				r.status === 'fulfilled',
		)
		.map(({ value: { data } }) => ({
			name: data.name,
			url: data.html_url,
			description: data.description ?? '',
			language: data.language ?? '',
			stars: data.stargazers_count,
		}));
};

/**
 * Renders the featured repositories as a list.
 *
 * Each entry leads with what the project solves, because a bare repo name and a
 * version number tell a visitor nothing about whether it is worth their time.
 */
export const handlerRenderFeaturedRepositories = (repositories: FeaturedRepository[]): string => {
	if (!repositories.length) return '';

	return repositories
		.map(({ name, url, description, language, stars }) => {
			const meta = [language, stars > 0 ? `⭐ ${stars}` : ''].filter(Boolean).join(' · ');
			const suffix = meta ? ` <small>${meta}</small>` : '';
			const summary = description ? `<br /><small>${description}</small>` : '';

			return `  <li><a href="${url}" target="_blank"><strong>${name}</strong></a>${suffix}${summary}</li>`;
		})
		.join('\n');
};

export const handlerGetYearsOld = (): number =>
	dateDifferenceInYears(new Date(PERSONAL.YEAR_OF_BIRTH), new Date());

const dateDifferenceInMonths = (dateInitial: Date, dateFinal: Date) =>
	Math.max(
		(dateFinal.getFullYear() - dateInitial.getFullYear()) * 12 +
			dateFinal.getMonth() -
			dateInitial.getMonth(),
		0,
	);

const dateDifferenceInYears = (dateInitial: Date, dateFinal: Date) =>
	Math.trunc(dateDifferenceInMonths(dateInitial, dateFinal) / 12);

/**
 * It takes an array of objects, maps over each object, and returns a string of
 * HTML
 * @returns A string of images
 */
export const handleGetTechnologies = () => {
	const _array: ImagesInterface[] = [
		{ file_name: 'ts', technology: 'Typescript' },
		{ file_name: 'js', technology: 'Javascript' },
		{ file_name: 'react', technology: 'React' },
		{ file_name: 'vue', technology: 'Vue' },
		{ file_name: 'svelte', technology: 'Svelte' },
		{ file_name: 'redux', technology: 'Redux' },
		{ file_name: 'html5', technology: 'HTML5' },
		{ file_name: 'css3', technology: 'CSS3' },
		{ file_name: 'node', technology: 'Nodejs' },
		{ file_name: 'mongodb', technology: 'MongoDB' },
		{ file_name: 'aws', technology: 'Amazon Web Services' },
		{ file_name: 'git', technology: 'Git' },
		{ file_name: 'firebase', technology: 'Firebase' },
	];

	return _array
		.map(
			({ file_name, technology }) =>
				`<img
					src='${BASE_URL.TECHNOLOGIES}/${file_name}.png?raw=true'
					alt=${technology}
					width='25'
					height='25'
				/>`,
		)
		.join(' ');
};
