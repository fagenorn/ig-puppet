/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import delay from 'delay';
import events from 'events';
import FollowFollowersOptions from '../../types/follow';
import User from '../../types/user';
import delays from '../../constants/delays.json';
import selectors from '../../constants/selectors.json';
import UserFilter from './filter/user-filter';
import BrowsingDetails from '../../types/playwright';

export default class Follow {
  static async followers(
    browse: BrowsingDetails,
    options: FollowFollowersOptions
  ) {
    const { page, cursor } = browse;

    if (!options.delay) {
      options.delay = delays.FOLLOW_DELAY;
    }

    if ((await page.$(selectors.SEARCH_INPUT_BTN)) === null) {
      return;
    }

    await cursor.click(selectors.SEARCH_INPUT_BTN);
    await page.type(selectors.SEARCH_INPUT, `@${options.username}`, {
      delay: delays.TYPE_DELAY,
    });

    await page.waitForSelector(selectors.SEARCH_FIRST_RESULT);

    if ((await page.$(selectors.SEARCH_FIRST_RESULT)) === null) {
      return;
    }

    await cursor.click(selectors.SEARCH_FIRST_RESULT);
    await page.waitForSelector(selectors.USER_FOLLOWERS);
    await cursor.click(selectors.USER_FOLLOWERS);
    await page.waitForSelector(selectors.USER_FOLLOWERS_USERS);

    const userInfoEmitter = new events.EventEmitter();
    const userInfos = new Map<string, User>();
    const userInfoIntercepter = async (listener: any) => {
      const userInfoUrlRegex = /instagram.com\/api\/v1\/users\/\d*\/info\//;
      if (userInfoUrlRegex.test(listener.url())) {
        const userBody: any = await (await listener.response()).json();
        const user: User = {
          username: userBody.user.username,
          name: userBody.user.full_name,
          bio: userBody.user.biography,
          followers: userBody.user.follower_count,
          followings: userBody.user.following_count,
          posts: userBody.user.media_count,
          isPrivate: userBody.user.is_private,
          website: userBody.user.external_url,
        };

        userInfos.set(user.username, user);
        userInfoEmitter.emit(user.username);
      }
    };

    page.on('requestfinished', userInfoIntercepter);

    const filter = options.filter ? new UserFilter(options.filter) : null;
    let followed = 0;
    for (let index = 0; followed < options.amount; index += 1) {
      userInfoEmitter.removeAllListeners();
      const elements = await page.$$(selectors.USER_FOLLOWERS_USERS);

      if (elements.length <= index) {
        const last = elements[elements.length - 1];
        try {
          await last.scrollIntoViewIfNeeded();
        } catch {
          // ignored
        }
        index -= 1;

        continue;
      }

      const element = elements[index];
      const usernameLink = await element.$('span > a');
      const followBtn = await element.$('div > button');

      if (!usernameLink || !followBtn) {
        continue;
      }

      const username = await usernameLink.getAttribute('title');
      let followStatus = await followBtn.textContent();

      if (followStatus !== 'Follow' || !username) {
        continue;
      }

      const promise = new Promise((resolve, reject) => {
        userInfoEmitter.once(username, resolve);
        setTimeout(
          () => (userInfos.has(username) ? resolve() : reject()),
          2_500
        );
      }).catch(() => null);

      try {
        await usernameLink.scrollIntoViewIfNeeded();
        await cursor.moveElement(usernameLink);
        await promise;
      } catch {
        // Usually means new items were loaded and item isn't attached to DOM anymore. Just retry loop.
        index -= 1;

        continue;
      }

      await cursor.move(selectors.PROFILE_DROP_DOWN_SHOW);
      const user = userInfos.get(username);

      if (!user) {
        continue;
      }

      if (!filter || !filter.isFiltered(user)) {
        if (followed > 0) await delay(options.delay);
        await cursor.clickElement(followBtn);
        await delay(1000);

        if (
          (await page.$(selectors.USER_FOLLOW_TRY_AGAIN_LATER)) !== null ||
          (await page.$(selectors.USER_FOLLOW_BLOCK)) !== null
        ) {
          throw new Error('Follow blocked.');
        }

        followStatus = await followBtn.textContent();
      }

      if (followStatus !== 'Follow') {
        followed += 1;
        console.info(`Followed ${user.username} successfully. (${followed})`);
      }
    }

    page.off('requestfinished', userInfoIntercepter);
  }
}
