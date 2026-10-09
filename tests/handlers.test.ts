import { describe, expect, it } from 'vitest';

import {
	handleGetTechnologies,
	handlerGetInstagramFileNames,
	handlerGetLatestInstagramImages,
	handlerGetTiburoncin,
	handlerGetYearsOld,
	handlerRenderAdpListComments,
	handlerRenderFeaturedRepositories,
	handlerSliceArticles,
	prettyDateFormat,
	wrapText,
} from '../src/handlers';
import { CODE_BLOCK_WIDTH, COUNT, TIBURONCIN } from '../src/constants';
import { GetCommentFromADPListResponse } from '../src/interfaces';

const article = (n: number) => ({
	title: `Article ${n}`,
	link: `https://eduardoalvarez.dev/articles/article-${n}`,
	pubDate: '2026-01-01',
});

const image = (n: number) => ({
	code: `code${n}`,
	url: `https://cdn.example.com/${n}.jpg`,
	type: 'feed',
	description: `Image ${n}`,
});

describe('prettyDateFormat', () => {
	// This is the regression that started it all: the function used to format in
	// whatever zone ran the generator, so the scheduled Action (UTC) and a local
	// machine produced different days for the same review.
	it('renders a timestamp in Chile time regardless of the host zone', () => {
		// 2024-06-01T02:00Z is still 31 May in Chile (UTC-4).
		expect(prettyDateFormat('2024-06-01T02:00:00.000Z')).toBe('31 de mayo de 2024');
	});

	it('does not shift a timestamp that is mid-day in Chile', () => {
		expect(prettyDateFormat('2024-05-29T16:00:00.000Z')).toBe('29 de mayo de 2024');
	});

	// The two cases above only prove the bug is gone on a machine that happens to
	// sit in Chile. This one holds wherever it runs, including a UTC CI runner.
	it('is stable when the process timezone changes', () => {
		const original = process.env.TZ;
		const rendered: string[] = [];

		try {
			for (const tz of [
				'UTC',
				'America/Santiago',
				'Asia/Tokyo',
				'America/New_York',
				'Pacific/Kiritimati',
			]) {
				process.env.TZ = tz;
				rendered.push(prettyDateFormat('2024-06-01T02:00:00.000Z'));
			}
		} finally {
			if (original === undefined) delete process.env.TZ;
			else process.env.TZ = original;
		}

		expect(new Set(rendered)).toEqual(new Set(['31 de mayo de 2024']));
	});
});

describe('handlerSliceArticles', () => {
	it('keeps at most COUNT.ARTICLES entries', () => {
		const output = handlerSliceArticles(
			Array.from({ length: COUNT.ARTICLES + 4 }, (_, i) => article(i)),
		);
		expect(output.split('\n')).toHaveLength(COUNT.ARTICLES);
	});

	it('renders each article as a markdown link', () => {
		expect(handlerSliceArticles([article(1)])).toBe(
			'- [Article 1](https://eduardoalvarez.dev/articles/article-1)',
		);
	});

	it('drops the leading dash when an article has no publication date', () => {
		const output = handlerSliceArticles([{ ...article(1), pubDate: '' }]);
		expect(output.startsWith('- ')).toBe(false);
	});

	it('returns an empty string for no articles', () => {
		expect(handlerSliceArticles([])).toBe('');
	});
});

describe('handlerGetLatestInstagramImages', () => {
	it('keeps at most COUNT.IMAGES entries', () => {
		const output = handlerGetLatestInstagramImages(
			Array.from({ length: COUNT.IMAGES + 3 }, (_, i) => image(i)),
		);
		expect(output.match(/<img/g)).toHaveLength(COUNT.IMAGES);
	});

	it('links each image to its Instagram permalink', () => {
		expect(handlerGetLatestInstagramImages([image(1)])).toContain(
			"href='https://instagram.com/p/code1'",
		);
	});

	// Captions are user-written and land inside a single-quoted alt attribute.
	it('strips markup and collapses whitespace in the alt text', () => {
		const output = handlerGetLatestInstagramImages([
			{ ...image(1), description: 'A <br/> caption  with&nbsp;<b>markup</b>' },
		]);
		expect(output).toContain("alt='A caption with markup'");
	});

	it('returns an empty string for no images', () => {
		expect(handlerGetLatestInstagramImages([])).toBe('');
	});
});

describe('handlerRenderFeaturedRepositories', () => {
	const repo = {
		name: 'vertical-timeline-component-react',
		url: 'https://github.com/Proskynete/vertical-timeline-component-react',
		description: 'A Timeline Component for React.js',
		language: 'TypeScript',
		stars: 57,
	};

	it('renders name, language, stars and description', () => {
		const output = handlerRenderFeaturedRepositories([repo]);
		expect(output).toContain('<strong>vertical-timeline-component-react</strong>');
		expect(output).toContain('TypeScript · ⭐ 57');
		expect(output).toContain('A Timeline Component for React.js');
	});

	it('omits the star count when a repository has none', () => {
		const output = handlerRenderFeaturedRepositories([{ ...repo, stars: 0 }]);
		expect(output).toContain('<small>TypeScript</small>');
		expect(output).not.toContain('⭐');
	});

	it('omits the meta block entirely when there is no language or stars', () => {
		const output = handlerRenderFeaturedRepositories([{ ...repo, language: '', stars: 0 }]);
		expect(output).not.toContain('<small></small>');
	});

	// A dropped repository must not leave a stray bullet in the profile.
	it('returns an empty string when every repository failed to resolve', () => {
		expect(handlerRenderFeaturedRepositories([])).toBe('');
	});
});

describe('handlerGetYearsOld', () => {
	it('returns a plausible age as a whole number', () => {
		const years = handlerGetYearsOld();
		expect(Number.isInteger(years)).toBe(true);
		expect(years).toBeGreaterThan(18);
		expect(years).toBeLessThan(120);
	});
});

describe('handleGetTechnologies', () => {
	it('renders one image per technology with alt text', () => {
		const output = handleGetTechnologies();
		expect(output).toContain('images/icons/ts.png');
		expect(output.match(/<img/g)!.length).toBeGreaterThan(10);
		expect(output).not.toContain('alt=""');
	});
});

describe('wrapText', () => {
	it('breaks between words without exceeding the width', () => {
		const lines = wrapText('uno dos tres cuatro cinco seis', 10);
		expect(lines).toEqual(['uno dos', 'tres', 'cuatro', 'cinco seis']);
		lines.forEach((line) => expect(line.length).toBeLessThanOrEqual(10));
	});

	it('collapses line breaks and repeated spaces', () => {
		expect(wrapText('uno\n\n  dos', 80)).toEqual(['uno dos']);
	});

	it('keeps a word longer than the width on its own line', () => {
		expect(wrapText('a supercalifragilistico b', 5)).toEqual(['a', 'supercalifragilistico', 'b']);
	});

	it('returns no lines for empty text', () => {
		expect(wrapText('   ', 10)).toEqual([]);
	});
});

describe('handlerRenderAdpListComments', () => {
	const comment = (n: number, review = `Review ${n}`): GetCommentFromADPListResponse => ({
		id: n,
		review,
		date_reviewed: '2024-05-29T16:00:00.000Z',
		overall_experience: 'Exceeds expectations',
		relevant_keywords: [],
		reviewed_by: { name: `Mentee ${n}`, slug: '', identity_type: '', employer: '' },
	});

	it('quotes the review and signs it with name and date', () => {
		expect(handlerRenderAdpListComments([comment(1)])).toBe(
			'> "Review 1"\n  — Mentee 1 · 29 de mayo de 2024',
		);
	});

	it('keeps at most COUNT.COMMENTS reviews, separated by a blank line', () => {
		const output = handlerRenderAdpListComments(
			Array.from({ length: COUNT.COMMENTS + 2 }, (_, i) => comment(i)),
		);
		expect(output.split('\n\n')).toHaveLength(COUNT.COMMENTS);
	});

	// Code blocks do not wrap on GitHub: a long review would scroll sideways.
	it('wraps long reviews to the code block width', () => {
		const output = handlerRenderAdpListComments([comment(1, 'palabra '.repeat(40))]);
		const lines = output.split('\n');
		expect(lines.length).toBeGreaterThan(3);
		lines.forEach((line) => expect(line.length).toBeLessThanOrEqual(CODE_BLOCK_WIDTH));
		expect(lines[1].startsWith('  ')).toBe(true);
	});

	it('returns an empty string for no reviews', () => {
		expect(handlerRenderAdpListComments([])).toBe('');
	});
});

describe('handlerGetInstagramFileNames', () => {
	it('lists the file names of the saved images like ls', () => {
		const images = [1, 2].map((n) => ({
			...image(n),
			url: `./images/instagram/post_0${n}.jpg`,
		}));
		expect(handlerGetInstagramFileNames(images)).toBe('post_01.jpg  post_02.jpg');
	});

	it('returns an empty string for no images', () => {
		expect(handlerGetInstagramFileNames([])).toBe('');
	});
});

describe('handlerGetTiburoncin', () => {
	const output = handlerGetTiburoncin();
	const rects = output.match(/<rect [^>]+\/>/g) ?? [];
	const size = TIBURONCIN.PIXEL_SIZE;

	it('covers every painted pixel of the grid exactly once', () => {
		const painted = TIBURONCIN.PIXELS.join('').replace(/\./g, '').length;
		const covered = rects.reduce(
			(total, rect) => total + Number(rect.match(/width="(\d+)"/)![1]) / size,
			0,
		);
		expect(covered).toBe(painted);
	});

	it('merges consecutive pixels of the same color into one rectangle', () => {
		// The last row is `.......kkkkkk.........`: one run of six outline pixels.
		const lastRow = (TIBURONCIN.PIXELS.length - 1) * size;
		expect(output).toContain(
			`<rect x="${7 * size}" y="${lastRow}" width="${6 * size}" height="${size}" fill="${TIBURONCIN.COLORS.k}"/>`,
		);
	});

	it('only uses the brand colors', () => {
		const colors = new Set(rects.map((rect) => rect.match(/fill="([^"]+)"/)![1]));
		expect([...colors].sort()).toEqual(Object.values(TIBURONCIN.COLORS).sort());
	});
});
