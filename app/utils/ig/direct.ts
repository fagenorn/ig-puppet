/* eslint-disable no-await-in-loop */
import DirectOptions from '../../types/direct';
import delays from '../../constants/delays.json';
import selectors from '../../constants/selectors.json';
import BrowsingDetails from '../../types/playwright';

export default class Direct {
  static async send(browse: BrowsingDetails, options: DirectOptions) {
    const { page, cursor } = browse;

    await cursor.click(selectors.DIRECT_INBOX_BTN);
    await page.waitForLoadState('networkidle');

    while (options.users.length > 0) {
      const users = options.users.splice(0, options.users_per_message);
      const message =
        options.messages[Math.floor(Math.random() * options.messages.length)];

      await page.waitForSelector(selectors.DIRECT_SEND_MSG_BTN);
      await cursor.click(selectors.DIRECT_SEND_MSG_BTN);
      await page.waitForLoadState('networkidle');

      for (let index = 0; index < users.length; index += 1) {
        const username = users[index];
        await page.waitForSelector(selectors.DIRECT_SEARCH_USER);
        await cursor.click(selectors.DIRECT_SEARCH_USER);
        await page.type(selectors.DIRECT_SEARCH_USER, username, {
          delay: delays.TYPE_DELAY,
        });

        await page.waitForLoadState('networkidle');
        await page.waitForSelector(selectors.DIRECT_SEARCH_USER_ADD_BTN);
        await cursor.click(selectors.DIRECT_SEARCH_USER_ADD_BTN);
      }

      await cursor.click(selectors.DIRECT_COMPOSE_MSG);

      await page.waitForSelector(selectors.DIRECT_MSG_INPUT);
      await cursor.click(selectors.DIRECT_MSG_INPUT);
      await page.type(selectors.DIRECT_MSG_INPUT, message, {
        delay: delays.TYPE_DELAY,
      });

      await page.waitForSelector(selectors.DIRECT_SUBMIT);
      await cursor.click(selectors.DIRECT_SUBMIT);
      await page.waitForLoadState('networkidle');
    }
  }
}
