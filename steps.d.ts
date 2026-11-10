/// <reference types='codeceptjs' />
type steps_file = typeof import('./steps_file');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any }
  interface Methods extends Playwright {}
  interface I extends ReturnType<steps_file> {
    async softWaitForElementVisibility(locator:string, timeout?:number): Promise<boolean>;
    waitForSpinnerToDisappear(timeout?: number): void;
    async waitForAppInit(timeout?: number): Promise<void>;
    robustClearField(locator: string, timeout?: number): void;
    safetyFillField(locator: string, textEntry: string, timeout?: number): void;
    hoverOn(locator: string, timeout?: number): void;
    safetyClick(locator: string, timeout?: number): void;
    async clickInViewport(locator: string, timeout?: number): Promise<void>;
  }
  namespace Translation {
    interface Actions {}
  }
}
