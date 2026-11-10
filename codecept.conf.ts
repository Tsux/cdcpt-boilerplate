import { setHeadlessWhen, setCommonPlugins } from '@codeceptjs/configure';
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: './tests/*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      browser: 'chromium',
      url: 'https://www.saucedemo.com/',
      waitForNavigation: "domcontentloaded",
      waitForTimeout: 60000,
      show: true,
      trace: true,
      windowSize: "1440x900",
      ignoreHTTPSErrors: true
    },
    "ResembleHelper" : {
      "require": "codeceptjs-resemblehelper",
      "screenshotFolder" : "./tests/output/",
      "baseFolder": "./tests/screenshots/base/",
      "diffFolder": "./tests/screenshots/diff/"
    }
  },
  include: {
    I: './steps_file'
  },
  plugins: {
    htmlReporter: {
      enabled: true
    },
  },
  name: 'cdcpt-boilerplate'
}