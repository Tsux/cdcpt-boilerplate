const { I } = inject();

const LoginPage = {
    locators: {
        acceptCookiesButton: ".cookie-modal-footer #btnAccept",
        userNameInput: "#signInName",
        passwordInput: "#password",
        signinButton: "#next"
    },

    async acceptCookies(timeout: number = 10): Promise<void> {
        if (await I.softWaitForElementVisibility(this.locators.acceptCookiesButton, timeout)) {
            I.waitForElement(this.locators.acceptCookiesButton, timeout);
            I.click(this.locators.acceptCookiesButton);
        }
    },

    login(userName: string, password: string, timeout: number = 10): void {
        I.waitForVisible(this.locators.userNameInput, timeout);
        I.waitForVisible(this.locators.passwordInput, timeout);

        I.fillField(this.locators.userNameInput, userName);
        I.fillField(this.locators.passwordInput, password);

        I.waitForVisible(this.locators.signinButton, timeout);
        I.click(this.locators.signinButton);
    }
};

export default LoginPage;
