import fs from 'fs';

import advancedSearchPage from '../page-objects/advanced-searh-page';
import homePage from '../page-objects/home-page';
import loginPage from '../page-objects/login-page';
import tsDataIngestor from '../utils/readXLS';
import assert from 'assert';

const { I } = inject();

Feature('Test Toolbox Inventory Metrics');

Scenario('Add Items to Cart', async ({ I }) => {
    const userName = process.env.TOOLBOX_USERNAME;
    const password = process.env.TOOLBOX_PASSWORD;
    if (!userName || !password) {
        throw new Error('Set TOOLBOX_USERNAME and TOOLBOX_PASSWORD before running this scenario.');
    }

    I.amOnPage('/');
    I.safetyFillField("#user-name", userName);
    I.safetyFillField("#password", password);
    I.safetyClick("#login-button");

    I.safetyClick("#add-to-cart-sauce-labs-backpack");
    I.waitForClickable("#remove-sauce-labs-backpack");
    I.safetyClick("#add-to-cart-sauce-labs-bike-light");
    I.waitForClickable("#remove-sauce-labs-bike-light");

    I.safetyClick("[data-test='shopping-cart-link']");

    const backpackQuantity = 
        await I.safetyGetText("//*[text()='Sauce Labs Backpack']//ancestor::*[@data-test='inventory-item']//*[@data-test='item-quantity']");
    assert.equal(1, backpackQuantity, "Backpack quantity should be 1");

    I.safetyClick("#checkout");

    I.safetyFillField("#first-name", "John");
    I.safetyFillField("#last-name", "Doe");
    I.safetyFillField("#postal-code", "12345");
    I.safetyClick("#continue");

    const itemA = await I.safetyGetText("[data-test='item-0-title-link']");
    const itemB = await I.safetyGetText("[data-test='item-4-title-link']");
    assert.equal("Sauce Labs Backpack", itemB, "Item B should be Sauce Labs Backpack");
    assert.equal("Sauce Labs Bike Light", itemA, "Item A should be Sauce Labs Bike Light");

    I.safetyClick("#finish");

    const completeHeader = await I.safetyGetText("[data-test='complete-header']");
    assert.equal("Thank you for your order!", completeHeader, "Complete header should be displayed");

    I.wait(10);
});

const categorizeSitesMismatchings = async (
    sitesCategories: Record<string, string[]>,
    category: string,
    foundSites: string[],
    notFoundSites: string[],
    foundPartialSiteNameMatches: Record<string, any>
): Promise<void> => {
    const sitesList = sitesCategories[category];
    for (const siteName of sitesList) {
        const sap = siteName.includes('++') ? siteName.split('++')[1] : undefined;
        const siteNameWithoutSap = siteName.includes('++') ? siteName.split('++')[0] : siteName;
        const cleanSiteName = (
            siteNameWithoutSap.includes('||')
                ? siteNameWithoutSap.split('||')[1].includes('check again')
                    ? siteNameWithoutSap.split('||')[0]
                    : siteNameWithoutSap.split('||')[1]
                : siteNameWithoutSap
        ).trim();

        advancedSearchPage.searhByLocationName(cleanSiteName, sap);
        if (!await advancedSearchPage.isExactMatchForSearchEntry(cleanSiteName)) {
            notFoundSites.push(cleanSiteName);
        } else {
            foundSites.push(cleanSiteName);
        }
    }
};
