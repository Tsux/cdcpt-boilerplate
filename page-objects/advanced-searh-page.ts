const { I } = inject();

const AdvancedSearchPage = {
    locators: {
        locationToggleButton: "#mat-button-toggle-1 button.mat-button-toggle-button",
        regionSelector: "#advancesearch-Category-select .mat-mdc-select-value",
        regionOption: (option: string) => `//mat-option//span[contains(text(),'${option}')]`,
        locationNameInput: "#advancesearch_txtName[placeholder='Location Name']",
        sapInput: "#advancesearch_txtAccountNumber",
        resultListPanel: "div.result-panel",
        resultListWrapper: "span.mdc-list-item__content",
        noResultsText: "//*[contains(@class,'result-panel')]//span[contains(text(), 'No Records Found')]",
        searchItemByName: (name: string) => `//*[contains(@class,"mat-mdc-list-item-")]//div[text()="${name}" or text()="${name} "]`,
        nextPageButton: 'button[aria-label="Next Page"]',
        nextPageButtonDisabled: 'button[aria-label="Next Page"][aria-disabled="true"]',
        loadingSpinner: ".ng-busy.ng-trigger-flyInOut.ng-star-inserted"
    },

    switchToLocationSearch(timeout: number = 30): void {
        I.safetyClick(this.locators.locationToggleButton, timeout);
    },

    selectRegion(regionOption: string, timeout: number = 30): void {
        I.safetyClick(this.locators.regionSelector, timeout);
        I.safetyClick(this.locators.regionOption(regionOption), timeout);
    },

    searhByLocationName(name: string, sap: string = undefined, timeout: number = 30): void {
        I.safetyFillField(this.locators.locationNameInput, name, timeout);
        I.clearField(this.locators.sapInput);
        if (sap) {
            I.safetyFillField(this.locators.sapInput, sap);
        }
        I.pressKey("Enter");
        this.waitForSearchToCompleteLoad();
    },

    async waitAndConfirmResultsPresence(timeout: number = 30): Promise<boolean> {
        I.waitForElement(this.locators.resultListPanel, timeout);
        const isNoResultsTextPresentAfterSearch = await I.grabNumberOfVisibleElements(this.locators.noResultsText) > 0;
        return !isNoResultsTextPresentAfterSearch;
    },

    async getVisibleElementsForExactMatch(searchEntry: string, timeout: number = 30): Promise<number> {
        const cleanSearch = this.cleanUpSearchEntry(searchEntry);
        const visibleElements = await I.grabNumberOfVisibleElements(this.locators.searchItemByName(cleanSearch));
        if (visibleElements > 1) {
            console.warn(`WARNING: More than one exact match found for site: ${cleanSearch}. Found ${visibleElements} matches`);
        }
        return visibleElements;
    },

    async isExactMatchForSearchEntry(searchEntry: string, timeout: number = 20): Promise<boolean> {
        const cleanSearch = this.cleanUpSearchEntry(searchEntry);
        if (await this.waitAndConfirmResultsPresence()) {
            I.waitForElement(this.locators.resultListWrapper, timeout);
            I.waitForElement(this.locators.nextPageButton, timeout);

            let visibleElements = await this.getVisibleElementsForExactMatch(cleanSearch, timeout);
            const isNextPageEnabled = await I.grabNumberOfVisibleElements(this.locators.nextPageButtonDisabled) === 0;

            if (visibleElements === 0 && isNextPageEnabled) {
                for (let page = 0; page < 50; page++) {
                    I.click(this.locators.nextPageButton);
                    this.waitForSearchToCompleteLoad();
                    visibleElements = await this.getVisibleElementsForExactMatch(cleanSearch, timeout);
                    if (visibleElements > 0) {
                        return true;
                    }

                    I.waitForElement(this.locators.nextPageButton, timeout);
                    const hasNextPage = await I.grabNumberOfVisibleElements(this.locators.nextPageButtonDisabled) === 0;
                    if (!hasNextPage) {
                        break;
                    }
                }
            }

            if (visibleElements === 0) {
                I.saveScreenshot(`${cleanSearch}_search_incidences_${new Date()}.png`);
            }
            return visibleElements > 0;
        }
        return false;
    },

    waitForSearchToCompleteLoad(timeout: number = 1200): void {
        I.waitForElement(this.locators.loadingSpinner, timeout / 2);
        I.waitForDetached(this.locators.loadingSpinner, timeout);
    },

    cleanUpSearchEntry(searchEntry: string): string {
        let result = '';
        for (let i = 0; i < searchEntry.length; i++) {
            const ch = searchEntry[i];
            if (ch === '"') {
                const prev = i > 0 ? searchEntry[i - 1] : '';
                result += prev === "\\" ? '"' : '\\"';
            } else {
                result += ch;
            }
        }
        return result.trim();
    }
};

export default AdvancedSearchPage;
