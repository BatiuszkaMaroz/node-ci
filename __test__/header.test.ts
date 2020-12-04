import { Page } from 'puppeteer';
import { WindowController as WC } from './utils/Window';

describe('header', () => {
  let controller: WC;
  let page: Page;

  beforeEach(async () => {
    controller = await WC.create();
    page = controller.page;
    await page.goto('http://localhost:3000');
  });

  afterEach(async () => {
    await controller.close();
  });

  it('shows title', async () => {
    const title = await controller.getHTML('a.brand-logo');
    expect(title).toEqual('Blogster');
  });

  it('shows oauth screen', async () => {
    await page.click('a[href="/auth/google"]');

    const url = page.url();
    expect(url).toMatch(/^https:\/\/accounts.google.com.+/);
  });

  describe('authenticated', () => {
    beforeEach(async () => {
      await controller.auth();
    });

    it('changes on auth', async () => {
      const anchors = (await page.$$('.nav-wrapper a')).length;
      expect(anchors).toEqual(3);

      const logout = await page.$eval(
        'a[href="/auth/logout"]',
        (elm) => elm.textContent,
      );
      expect(logout).toEqual('Logout');
    });
  });
});
