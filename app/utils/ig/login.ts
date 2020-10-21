import LoginOptions from '../../types/login';
import delays from '../../constants/delays.json';
import popups from './popup';
import selectors from '../../constants/selectors.json';
import BrowsingDetails from '../../types/playwright';

export default class Login {
  static async login(browse: BrowsingDetails, options: LoginOptions) {
    // Check if login is needed.
    if ((await browse.page.$(selectors.LOGIN_SUBMIT)) === null) {
      return;
    }

    const { page, cursor } = browse;
    await popups.dismiss(browse);

    await cursor.click(selectors.LOGIN_USERNAME_INPUT);
    await page.type(selectors.LOGIN_USERNAME_INPUT, options.username, {
      delay: delays.TYPE_DELAY,
    });

    await cursor.click(selectors.LOGIN_PASSWORD_INPUT);
    await page.type(selectors.LOGIN_PASSWORD_INPUT, options.password, {
      delay: delays.TYPE_DELAY,
    });

    await cursor.click(selectors.LOGIN_SUBMIT);

    await Promise.race([
      page.waitForSelector(selectors.PROFILE_DROP_DOWN_SHOW),
      page.waitForSelector(selectors.LOGIN_ERROR),
    ]);

    if ((await page.$(selectors.LOGIN_ERROR)) !== null) {
      throw new Error(`Login failed for ${options.username}.`);
    }
  }

  static async logout(browse: BrowsingDetails) {
    const { page, cursor } = browse;

    // Check if logout is possible.
    if ((await page.$(selectors.PROFILE_DROP_DOWN_SHOW)) === null) {
      return;
    }

    await cursor.click(selectors.PROFILE_DROP_DOWN_SHOW);
    await cursor.click(selectors.PROFILE_DROPW_DOWN_LOGOUT_SUBMIT);

    await page.waitForNavigation({ waitUntil: 'networkidle' });
  }
}
