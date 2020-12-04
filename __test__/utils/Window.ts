import { Browser, launch, Page } from 'puppeteer';
import { createSession } from '../helpers/session';
import { createUser } from '../helpers/users';
import { Document } from 'mongoose';
import Blog from '../../models/Blog';

export class WindowController {
  private user?: Document;

  private constructor(public browser: Browser, public page: Page) {}

  async auth(url?: string) {
    const { page } = this;

    const user = await createUser();
    const { sessionSig, session } = await createSession(user);
    this.user = user;

    await page.setCookie(
      { name: 'session', value: session },
      { name: 'session.sig', value: sessionSig },
    );

    if (url) {
      await page.goto(url);
    } else {
      await page.reload();
    }

    // Istnieje szansa że puppeteer zacznie wyszukiwac
    // zanim załaduje się UI po otrzymaniu auth - response
    await page.waitForSelector('a[href="/auth/logout"]');
  }

  async getHTML(selector: string) {
    const { page } = this;
    return await page.$eval(selector, (elm) => elm.innerHTML);
  }

  async makeRequests(
    actions: { method: 'get' | 'post'; path: string; data?: any }[],
  ) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      }),
    );
  }

  async get(path: string) {
    const { page } = this;

    const result = await page.evaluate((p) => {
      return fetch(p, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      }).then((res) => res.json());
    }, path);

    return result;
  }

  async post(path: string, data: any) {
    const { page } = this;

    const result = await page.evaluate(
      (p, d) => {
        return fetch(p, {
          method: 'POST',
          body: JSON.stringify(d),
          headers: {
            'content-type': 'application/json',
          },
        }).then((res) => res.json());
      },
      path,
      data,
    );

    return result;
  }

  async close() {
    const { browser, user } = this;

    if (user) {
      await Blog.deleteMany({ _user: user._id });
      await user.remove();
    }

    await browser.close();
  }

  static async create() {
    const browser = await launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    return new WindowController(browser, page);
  }
}

// export class CustomPage {
//   constructor(public page: Page) {}

//   static async build() {
//     const browser = await launch({ headless: false });
//     const page = await browser.newPage();
//     const customPage = new CustomPage(page);

//     return new Proxy(customPage, {
//       get: function (
//         target,
//         property: keyof CustomPage | keyof Page | keyof Browser,
//       ) {
//         return (
//           target[property as keyof CustomPage] ||
//           browser[property as keyof Browser] ||
//           page[property as keyof Page]
//         );
//       },
//     });
//   }
// }
