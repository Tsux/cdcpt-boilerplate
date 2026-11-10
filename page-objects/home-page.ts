const { I } = inject();

const HomePage = {
    locators: {
        filterOption: (option: string) => `//mat-option[starts-with(@id, 'mat-option')]//span[contains(text(),'${option}')]`,
        searchInput: "input[name='commonSearch']"
    },

    openAdvanceSearch(timeout: number = 60): void {
        I.waitForElement(this.locators.searchInput, timeout);
        I.click(this.locators.searchInput);
        const avSearchOption = this.locators.filterOption("Advanced Search");
        I.waitForElement(avSearchOption, timeout);
        I.click(avSearchOption);
    }
};

export default HomePage;
