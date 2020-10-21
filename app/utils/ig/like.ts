/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import delay from 'delay';
import { ElementHandle, Request } from 'playwright-core';
import log from 'electron-log';
import LikeHashtagOptions from '../../types/like';
import Post from '../../types/post';
import delays from '../../constants/delays.json';
import selectors from '../../constants/selectors.json';
import PostFilter from './filter/post-filter';
import BrowsingDetails from '../../types/playwright';

export default class Like {
  static async tags(browse: BrowsingDetails, options: LikeHashtagOptions) {
    const { page, cursor } = browse;

    if (!options.delay) {
      options.delay = delays.LIKE_DELAY;
    }

    if ((await page.$(selectors.SEARCH_INPUT)) === null) {
      return;
    }

    await cursor.click(selectors.SEARCH_INPUT);
    await page.type(selectors.SEARCH_INPUT, `#${options.tag}`, {
      delay: delays.TYPE_DELAY,
    });

    await page.waitForSelector(selectors.SEARCH_FIRST_RESULT);

    if ((await page.$(selectors.SEARCH_FIRST_RESULT)) === null) {
      return;
    }

    await cursor.click(selectors.SEARCH_FIRST_RESULT);
    await page.waitForSelector(selectors.SEARCH_RECENT_FEED_POSTS);

    const postInfos = new Map<string, Post>();
    const postInfoIntercepter = async (listener: Request) => {
      const postInfoUrlRegex = /instagram\.com\/graphql\/query\/\?query_hash=.*/;
      if (postInfoUrlRegex.test(listener.url())) {
        const response = await listener.response();
        if (!response) return;
        const postBody: any = await response.json();
        if (!postBody.data.shortcode_media) {
          return;
        }

        const date = new Date(0);
        date.setUTCSeconds(postBody.data.shortcode_media.taken_at_timestamp);
        const post: Post = {
          age: date,
          caption:
            postBody.data.shortcode_media.edge_media_to_caption.edges[0].node
              .text,
          likes: postBody.data.shortcode_media.edge_media_preview_like.count,
          shortcode: postBody.data.shortcode_media.shortcode,
        };

        postInfos.set(post.shortcode, post);
      }
    };

    page.on('requestfinished', postInfoIntercepter);

    const filter = options.filter ? new PostFilter(options.filter) : null;
    const processed = new Set<string>();
    let shortcode = '';
    let liked = 0;
    for (let index = 0; liked < options.amount; index += 1) {
      const elements = await page.$$(selectors.SEARCH_RECENT_FEED_POSTS);
      let element: ElementHandle<SVGElement | HTMLElement> | undefined;
      for (let j = 0; j < elements.length; j += 1) {
        const current = elements[j];
        const match = (
          await current.$eval('a', (el: HTMLLinkElement) => el.href)
        ).match(/instagram\.com\/p\/(.*)\//);

        if (match) {
          // eslint-disable-next-line prefer-destructuring
          shortcode = match[1];
        }

        if (!processed.has(shortcode)) {
          processed.add(shortcode);
          element = current;
          break;
        }
      }

      if (!element) {
        continue;
      }

      await cursor.clickElement(element);

      try {
        await page.waitForSelector(selectors.SEARCH_LIKE_POST_STATUS, {
          timeout: 5_000,
        });
      } catch {
        log.info(`Failed to like https://www.instagram.com/p/${shortcode}/.`);
        await cursor.click(selectors.SEARCH_CLOSE_POST);

        continue;
      }

      // Check like status
      let likeStatus = await page.$eval(
        selectors.SEARCH_LIKE_POST_STATUS,
        (el) => el.getAttribute('aria-label')
      );

      if (likeStatus !== 'Like') {
        await cursor.click(selectors.SEARCH_CLOSE_POST);

        continue;
      }

      await page.waitForSelector(selectors.SEARCH_LIKE_POST);

      const post = postInfos.get(shortcode);
      if (filter && post && filter.isFiltered(post)) {
        await cursor.click(selectors.SEARCH_CLOSE_POST);

        continue;
      }

      if (liked > 0 && options.delay) await delay(options.delay);
      await cursor.click(selectors.SEARCH_LIKE_POST);
      await delay(1000);

      if (
        (await page.$(selectors.USER_FOLLOW_TRY_AGAIN_LATER)) !== null ||
        (await page.$(selectors.USER_FOLLOW_BLOCK)) !== null
      ) {
        throw new Error('Like blocked.');
      }

      await page.waitForSelector('svg[aria-label="Unlike"]');
      likeStatus = await page.$eval(selectors.SEARCH_LIKE_POST_STATUS, (el) =>
        el.getAttribute('aria-label')
      );

      if (likeStatus !== 'Like') {
        liked += 1;
        log.info(
          `Liked https://www.instagram.com/p/${shortcode}/ successfully. (${liked})`
        );
      }

      await cursor.click(selectors.SEARCH_CLOSE_POST);
    }

    page.off('requestfinished', postInfoIntercepter);
  }
}
