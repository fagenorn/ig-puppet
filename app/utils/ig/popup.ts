import selectors from '../../constants/selectors.json';
import BrowsingDetails from '../../types/playwright';

export default class Popups {
  static async dismiss(browse: BrowsingDetails) {
    const { page, cursor } = browse;

    if ((await page.$(selectors.POPUP_SAVE_INFO)) !== null) {
      await cursor.click(selectors.POPUP_SAVE_INFO);
      await page.waitForLoadState('networkidle');
    }

    if ((await page.$(selectors.POPUP_TURN_ON_NOTIFICATIONS)) !== null) {
      await cursor.click(selectors.POPUP_TURN_ON_NOTIFICATIONS);
    }

    try {
      await page.waitForSelector(selectors.POPUP_ACCEPT_COOKIES, {
        timeout: 1_000,
      });
    } catch {
      // ignored
    }

    if ((await page.$(selectors.POPUP_ACCEPT_COOKIES)) !== null) {
      await cursor.click(selectors.POPUP_ACCEPT_COOKIES);
    }
  }
}
