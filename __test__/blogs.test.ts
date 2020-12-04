import { Page } from 'puppeteer';
import { WindowController as WC } from './utils/Window';

describe('blogs', () => {
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

  describe('unauthenticated', () => {
    const actions: { method: 'get' | 'post'; path: string; data?: any }[] = [
      {
        method: 'get',
        path: '/api/blogs',
      },
      {
        method: 'post',
        path: '/api/blogs',
        data: {
          title: 'Hussain Bolt!',
          content: ':3',
        },
      },
    ];

    test('refuses actions which require authentication', async () => {
      const resultArr = await controller.makeRequests(actions);

      resultArr.forEach((res) => {
        expect(res).toEqual({ error: 'You must log in!' });
      });

      // for await (const { method, path, data } of actions) {
      //   let result;

      //   result = await controller[method](path, data);

      //   expect(result).toEqual({ error: 'You must log in!' });
      // }
    });

    // it('refuses direct POST request', async () => {
    //   const result = await controller.post('/api/blogs', {
    //     title: 'Hussain Bolt!',
    //     content: ':3',
    //   });

    //   expect(result).toEqual({ error: 'You must log in!' });
    // });

    // it('refuses direct GET request', async () => {
    //   const result = await controller.get('/api/blogs');

    //   expect(result).toEqual({ error: 'You must log in!' });
    // });
  });

  describe('authenticated', () => {
    beforeEach(async () => {
      await controller.auth('http://localhost:3000/blogs');
      await page.click('a[href="/blogs/new"]');
    });

    it('opens creation form', async () => {
      const label = await controller.getHTML('label');
      expect(label).toEqual('Blog Title');
    });

    describe('valid inputs', () => {
      beforeEach(async () => {
        await page.type('.title input', 'Nice title');
        await page.type('.content input', 'Nice content');
        await page.click('button.teal');
      });

      it('ask for confirmation', async () => {
        const heading = await controller.getHTML('h5');
        expect(heading).toEqual('Please confirm your entries');
      });

      it('adds new post', async () => {
        await page.click('form button.green');
        await page.waitForSelector('.card');

        const postTitle = await controller.getHTML(
          '.card:last-child .card-title',
        );

        const postContent = await controller.getHTML(
          '.card:last-child .card-content p',
        );

        expect(postTitle).toEqual('Nice title');
        expect(postContent).toEqual('Nice content');
      });
    });

    describe('invalid inputs', () => {
      beforeEach(async () => {
        await page.click('button.teal');
      });

      it('shows error', async () => {
        const titleError = await controller.getHTML('.title .red-text');
        expect(titleError).toEqual('You must provide a value');

        const contentError = await controller.getHTML('.content .red-text');
        expect(contentError).toEqual('You must provide a value');
      });
    });
  });
});
