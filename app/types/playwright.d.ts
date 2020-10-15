import { BrowserContext, Page } from 'playwright';
import GhostMouse from '../utils/mouse-movement';

export default interface BrowsingDetails {
  page: Page;
  browser: BrowserContext;
  cursor: GhostMouse;
}
