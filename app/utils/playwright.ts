import { LaunchOptions, Browser, BrowserType } from 'playwright-core';
import { firefox } from 'playwright-firefox';
import { remote } from 'electron';
import path from 'path';
import log from 'electron-log';
import delays from '../constants/delays.json';
import SessionOptions from '../types/session';
import installMouseHelper from './mouse-helper';
import login from './ig/login';
import popup from './ig/popup';
import FollowFollowersOptions from '../types/follow';
import follow from './ig/follow';
import like from './ig/like';
import direct from './ig/direct';
import BrowsingDetails from '../types/playwright';
import GhostMouse from './mouse-movement';
import LikeHashtagOptions from '../types/like';
import DirectOptions from '../types/direct';

export default class PlaywrightService {
  private static readonly HEADLESS: boolean = false;

  private static readonly BROWSER: BrowserType<Browser> = firefox;

  public static async follow_followers(
    options: SessionOptions,
    action_settings: FollowFollowersOptions
  ) {
    let browse: BrowsingDetails | null = null;
    try {
      browse = await this.action(options);
      await follow.followers(browse, action_settings);
    } finally {
      if (browse) await browse.browser.close();
    }
  }

  public static async like_tag(
    options: SessionOptions,
    action_settings: LikeHashtagOptions
  ) {
    let browse: BrowsingDetails | null = null;
    try {
      browse = await this.action(options);
      await like.tags(browse, action_settings);
    } finally {
      if (browse) await browse.browser.close();
    }
  }

  public static async direct(
    options: SessionOptions,
    action_settings: DirectOptions
  ) {
    let browse: BrowsingDetails | null = null;
    try {
      browse = await this.action(options);
      await direct.send(browse, action_settings);
    } finally {
      if (browse) await browse.browser.close();
    }
  }

  private static async action(
    options: SessionOptions
  ): Promise<BrowsingDetails> {
    const browse = await this.start(options);

    try {
      await login.login(browse, options);
      await popup.dismiss(browse);
    } catch (error) {
      log.error(error);
    }

    return browse;
  }

  private static getFirefoxPath() {
    const relative =
      'node_modules\\playwright-firefox\\.local-browsers\\firefox-1188\\firefox\\firefox.exe';

    return remote.app.isPackaged
      ? path.join(process.resourcesPath, 'app.asar.unpacked', relative)
      : path.join(__dirname, relative);
  }

  private static async start(
    options: SessionOptions
  ): Promise<BrowsingDetails> {
    try {
      const launchOptions: LaunchOptions = {
        headless: this.HEADLESS,
        slowMo: delays.SLOW_MO,
        executablePath: PlaywrightService.getFirefoxPath(),
      };

      if (options.proxy) {
        launchOptions.proxy = {
          server: `${options.proxy.host}:${options.proxy.port}`,
        };

        if (options.proxy.password && options.proxy.username) {
          launchOptions.proxy.username = options.proxy.username;
          launchOptions.proxy.password = options.proxy.password;
        }
      }

      const browser = await this.BROWSER.launchPersistentContext(
        path.join(remote.app.getPath('userData'), 'tmp', options.id),
        launchOptions
      );

      const page = await browser.newPage();
      await installMouseHelper(page);
      await page.route(/.*(\.(png|jpeg|jpg|mp4)($|\?))/, (route) =>
        route.abort()
      );
      await page.goto('https://www.instagram.com/', {
        waitUntil: 'networkidle',
      });

      return { page, browser, cursor: new GhostMouse(page) };
    } catch (error) {
      log.info(error);
      throw error;
    }
  }
}
