// POC for Puppeteer + WebDriver helpers integration
const pageLoaded = page => 
    new Promise((resolve) => {
        page.once('load', () => resolve)
    });

class MyPuppeteer extends Helper {
    async waitForPageLoad() {
        const { page } = this.helpers.Puppeteer;
        await pageLoaded(page);
    }
}

module.exports = MyPuppeteer;