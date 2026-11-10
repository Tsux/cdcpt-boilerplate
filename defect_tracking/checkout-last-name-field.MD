# Bug: Last name input changes the first name at Checkout

## Summary
Typing in the last name field on the Checkout Information page changes the first name field instead.

## Test Conditions
- Browser: Chrome
- Test user: problem_user / secret_sauce
- Environment: QA

## Preconditions
None

## Steps to Reproduce
1. Login
2. Add a product to the Cart and proceed to the Checkout Information page.
3. Type into the last name field.

## Result
All characters entered in the last name field appear in the first name field instead. Because all form fields are mandatory, the user cannot complete a purchase.

## Attachments
Add or link screenshots, videos, and logs.
- Screencast: ![Info form not submitable](<./sc_checkoutBlockerUponInfoForm.gif>)
- Logs / error messages: {{ }}

## Notes / Additional Info
Reported severity: Critical. Reported as a blocker for project effects such as a release or hot-fix.
