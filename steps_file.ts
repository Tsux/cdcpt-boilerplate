// in this file you can append custom step methods to 'I' object

import { loadEnvFile } from "process";

export = function() {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    waitForSpinnerToDisappear(timeout: number = 120): void {
      const spinnerLocator = '.ng-busy-default-text';
      this.waitForVisible(spinnerLocator, timeout);
      this.waitForDetached(spinnerLocator, timeout);
    },

    // TODO: Test method
    async waitForAppInit(timeout: number = 120): Promise<void> {
      const loadingSpinner = '#loginImage+div img[alt="loading"]';
      const loginLogo = '#loginImage img[alt="loginlogo"]';

      this.waitForVisible(loadingSpinner, timeout);
      let isSpinnerVisible = true;
      for(let x = 0; x <= timeout; x++){
        this.wait(1);
        const isLoginLogoVisible = await this.grabNumberOfVisibleElements(loginLogo) > 0;
        isSpinnerVisible = await this.grabNumberOfVisibleElements(loadingSpinner) > 0;
        if(isLoginLogoVisible) {
          this.refreshPage();
        }
        if(!isSpinnerVisible) {
          break;
        }
      }
    },

    /**
     * Alternative clear field method that clicks the field, select all and delete. Useful for fields that do not respond well to standard clearField (like search inputs with auto-suggest)
     * @param locator 
     * @param timeout 
     */
    robustClearField(locator: string, timeout: number = 30): void {
      this.waitForVisible(locator, timeout);
      this.click(locator);
      // Select all and delete (works for most input fields)
      this.pressKey(['Meta', 'a']); // Use 'Control' for Windows/Linux
      this.pressKey('Backspace');
    },

    /**
     * Safety fills input in 3 steps:
     *     1. Wait for Visibility
     *     2. Clear input
     *     3. Fill field
     * @param locator 
     * @param timeout 
     */
    safetyFillField(locator: string, textEntry: string, timeout: number = 30): void {
      this.waitForVisible(locator, timeout);
      this.robustClearField(locator, timeout);
      this.fillField(locator, textEntry);
    },

    /**
     * Safety hover on element by waiting for visibility and run move cursor to it
     * @param locator
     * @param timeout
     */
    hoverOn(locator: string, timeout: number = 60): void {
      this.waitForVisible(locator, timeout);
      this.moveCursorTo(locator);
    },

    /**
     * Safety click on element by waiting for clickable first
     * @param locator
     * @param timeout
     */
    safetyClick(locator: string, timeout: number = 60): void {
      this.waitForVisible(locator, timeout);
      this.click(locator);
    },

    /**
     * Ensure click using scroll to match element in viewport
     * @param locator 
     * @param timeout 
     */
    async clickInViewport(locator: string, timeout: number = 60): Promise<void> {
      const runtimeHelpers = (this && (this as any).helpers) || (() => {
        try {
          const { container } = require('codeceptjs');
          return container.helpers();
        } catch {
          return null;
        }
      })();
      const playwrightHelper = runtimeHelpers && (runtimeHelpers.Playwright || runtimeHelpers.playwright);
      if (playwrightHelper) {
        const page = playwrightHelper.page;
        try {
          console.log(`Attempt to click on >> \n${locator}`);
          const element = page.locator(locator);
          await element.scrollIntoViewIfNeeded({ timeout: timeout * 1000 });
          await element.waitFor({ state: 'visible', timeout: timeout * 1000 });
          await element.waitFor({ state: 'enabled', timeout: timeout * 1000 });
          await element.click({ timeout: timeout * 1000 });
          return;
        } catch (e) {
          console.log('Playwright click failed, falling back to CodeceptJS click');
          this.click(locator);
        }
      } else {
        this.click(locator);
      }
    },

    /**
     * Safety get text from element by:
     *     1. Wait for visibility
     *     2. Getting the text
     *     3. Applying trim
     * @param locator 
     * @param timeout 
     */
    async safetyGetText(locator: string, timeout: number = 120): Promise<string> {
      this.waitForVisible(locator, timeout);
      return (await this.grabTextFrom(locator)).trim();
    },

    /**
     * Softly wait for element to be displayed
     * @param locator 
     * @param timeout
     * @returns 
     */
    async softWaitForElementVisibility(locator:string, timeout:number = 60): Promise<boolean> {
      const runtimeHelpers = (this && (this as any).helpers) || (() => {
        try {
          const { container } = require('codeceptjs');
          return container.helpers();
        } catch {
          return null;
        }
      })();
      
      const playwrightHelper = runtimeHelpers && (runtimeHelpers.Playwright || runtimeHelpers.playwright);
      if (!playwrightHelper) {
        throw new Error('Playwright helper not found. Check helper name in codecept config (should be "Playwright").');
      }
      const page = playwrightHelper.page;
      
      try {
        //console.log(`Soft waiting for visibility of element: ${locator} with timeout: ${timeout}s`);
        await page.locator(locator).isVisible({ timeout: timeout * 1000 });
        return true;
      } catch (error) {
        return false;
      }
     }
  });
}
