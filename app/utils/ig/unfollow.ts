/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import delay from 'delay';
import events from 'events';
import log from 'electron-log';
import User from '../../types/user';
import delays from '../../constants/delays.json';
import selectors from '../../constants/selectors.json';
import UserFilter from './filter/user-filter';
import BrowsingDetails from '../../types/playwright';
import UnfollowFollowersOptions from '../../types/unfollow';
import scraper from './scraper';

export default class Unfollow {
  static async unfollow(
    browse: BrowsingDetails,
    options: UnfollowFollowersOptions
  ) {
    const { page, cursor } = browse;

    if (!options.delay) {
      options.delay = delays.UNFOLLOW_DELAY;
    }

    let followers = [] as string[];
    if (options.ignoreFollowers) {
      followers = await scraper.get_own_followers(browse, { amount: 2500 });
      await cursor.click(selectors.USER_FOLLOWERS_DIALOG_CLOSE);
    }

    // Go to current user profile
    await cursor.click(selectors.PROFILE_DROP_DOWN_SHOW);
    await cursor.click(selectors.PROFILE_DROPW_DOWN_PROFILE_SUBMIT);

    await page.waitForSelector(selectors.USER_FOLLOWINGS);
    await cursor.click(selectors.USER_FOLLOWINGS);
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
    let unfollowed = 0;
    for (let index = 0; unfollowed < options.amount; index += 1) {
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
      const unfollowBtn = await element.$('div > button');

      if (!usernameLink || !unfollowBtn) {
        continue;
      }

      const username = await usernameLink.getAttribute('title');
      let followStatus = await unfollowBtn.textContent();

      if (followStatus !== 'Following' || !username) {
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

      if (
        (!filter || !filter.isFiltered(user)) &&
        followers.indexOf(user.username) === -1
      ) {
        if (unfollowed > 0) await delay(options.delay);
        await cursor.clickElement(unfollowBtn);
        await cursor.click(selectors.USER_UNFOLLOW_SUBMIT);
        await delay(1000);

        if (
          (await page.$(selectors.USER_FOLLOW_TRY_AGAIN_LATER)) !== null ||
          (await page.$(selectors.USER_FOLLOW_BLOCK)) !== null
        ) {
          throw new Error('Unfollow blocked.');
        }

        await unfollowBtn.waitForSelector('"Follow"');
        followStatus = await unfollowBtn.textContent();
      }

      if (followStatus === 'Follow') {
        unfollowed += 1;
        log.info(`Unfollowed ${user.username} successfully. (${unfollowed})`);
      }
    }

    page.off('requestfinished', userInfoIntercepter);
  }
}
