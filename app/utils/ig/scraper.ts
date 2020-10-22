/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import delay from 'delay';
import events from 'events';
import delays from '../../constants/delays.json';
import selectors from '../../constants/selectors.json';
import BrowsingDetails from '../../types/playwright';
import ScraperOptions from '../../types/scraper';

export default class Scraper {
  static async get_own_followers(
    browse: BrowsingDetails,
    options: ScraperOptions
  ): Promise<string[]> {
    const { page, cursor } = browse;

    if (!options.delay) {
      options.delay = delays.SCRAPER_DELAY;
    }

    // Go to current user profile
    await cursor.click(selectors.PROFILE_DROP_DOWN_SHOW);
    await cursor.click(selectors.PROFILE_DROPW_DOWN_PROFILE_SUBMIT);

    // Open followers dialog
    await page.waitForSelector(selectors.USER_FOLLOWERS);
    await cursor.click(selectors.USER_FOLLOWERS);
    await page.waitForSelector(selectors.USER_FOLLOWERS_USERS);

    const userInfoEmitter = new events.EventEmitter();
    const userInfos = [] as string[];
    const userInfoIntercepter = async (listener: any) => {
      const userInfoUrlRegex = /instagram\.com\/graphql\/query\/\?query_hash=.*/;
      if (userInfoUrlRegex.test(listener.url())) {
        const userBody: any = await (await listener.response()).json();
        const edges = userBody.data?.user?.edge_followed_by?.edges;
        if (!edges) return;
        for (let index = 0; index < edges.length; index += 1) {
          const { node } = edges[index];
          userInfos.push(node.username);
        }

        userInfoEmitter.emit('event');
      }
    };

    page.on('requestfinished', userInfoIntercepter);

    for (let index = 0; userInfos.length < options.amount; index += 1) {
      userInfoEmitter.removeAllListeners();
      const elements = await page.$$(selectors.USER_FOLLOWERS_USERS);
      const last = elements[elements.length - 1];

      const promise = new Promise((resolve, reject) => {
        userInfoEmitter.once('event', resolve);
        setTimeout(reject, 2_500);
      });

      try {
        await last.scrollIntoViewIfNeeded();
        await promise;
        await delay(options.delay);
      } catch {
        break;
      }
    }

    page.off('requestfinished', userInfoIntercepter);

    return userInfos;
  }
}
