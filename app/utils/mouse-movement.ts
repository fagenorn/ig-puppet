import { ElementHandle, Page } from 'playwright';

const bezier = require('adaptive-bezier-curve');

export default class GhostMouse {
  page: Page;

  lastPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(page: Page) {
    this.page = page;
  }

  async click(selector: string) {
    await this.move(selector);
    await this.page.mouse.down();
    await this.page.mouse.up();
  }

  async clickElement(element: ElementHandle<SVGElement | HTMLElement>) {
    await this.moveElement(element);
    await this.page.mouse.down();
    await this.page.mouse.up();
  }

  async move(selector: string) {
    const element = await this.page.$(selector);
    if (!element) return;
    await this.moveElement(element);
  }

  async moveElement(element: ElementHandle<SVGElement | HTMLElement>) {
    await element.scrollIntoViewIfNeeded();
    const box = await element.boundingBox();
    if (!box) return;
    const target = { x: box.x + box.width / 2, y: box.y + box.height / 2 };

    const points = bezier(
      [this.lastPosition.x, this.lastPosition.y],
      [this.lastPosition.x + 50, this.lastPosition.y + 100],
      [target.x + 50, target.y + 100],
      [target.x, target.y]
    );

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      // eslint-disable-next-line no-await-in-loop
      await this.page.mouse.move(point[0], point[1]);
      this.lastPosition = { x: point[0], y: point[1] };
    }
  }
}
