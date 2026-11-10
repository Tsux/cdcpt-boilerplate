# Bug: Empty Cart has no call to action

## Summary
No call-to-action message is displayed on the Cart page when the Cart is empty.

## Test Conditions
- Browser: Chrome
- Test user: standard_user / secret_sauce
- Environment: QA

## Preconditions
None

## Steps to Reproduce
1. Login
2. Navigate to the Cart page without adding a product.
3. Observe the empty Cart page.

## Result
The App displays an empty screen without a call to action or product suggestion.

## Attachments
- Screenshot(s): "[Empty Cart Page](<./ss_emptyCartPage.png>)

## Notes / Additional Info
Reported as an overall issue, not limited to `problem_user` experiences. A call to action or product suggestion may improve the user experience.
