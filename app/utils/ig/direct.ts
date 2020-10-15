import DirectOptions from '../../types/direct';
import delays from '../../constants/delays.json';
import selectors from '../../constants/selectors.json';
import BrowsingDetails from '../../types/playwright';

export default class Direct {
  static async send(browse: BrowsingDetails, options: DirectOptions) {
    const { page, cursor } = browse;

    await cursor.click(selectors.DIRECT_INBOX_BTN);
    await page.waitForSelector(selectors.DIRECT_SEND_MSG_BTN);
    await cursor.click(selectors.DIRECT_SEND_MSG_BTN);
    await page.waitForSelector(selectors.DIRECT_SEARCH_USER);

    /* eslint-disable no-await-in-loop */
    for (let index = 0; index < options.users.length; index += 1) {
      const username = options.users[index];
      await page.type(selectors.DIRECT_SEARCH_USER, username, {
        delay: delays.TYPE_DELAY,
      });
      await page.waitForSelector(selectors.DIRECT_SEARCH_USER_ADD_BTN);
      await cursor.click(selectors.DIRECT_SEARCH_USER_ADD_BTN);
    }
    /* eslint-enable no-await-in-loop */

    await cursor.click(selectors.DIRECT_COMPOSE_MSG);
    await page.waitForSelector(selectors.DIRECT_MSG_INPUT);

    await page.type(selectors.DIRECT_MSG_INPUT, options.message, {
      delay: delays.TYPE_DELAY,
    });

    await cursor.click(selectors.DIRECT_SUBMIT);
  }
}
