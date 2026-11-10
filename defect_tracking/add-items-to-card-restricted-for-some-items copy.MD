# Bug: Add-to-Cart action does not work for some items in Product Catalog

## Summary
User is unable to add to Cart some items listed at Product Catalog page; namely, "Sauce Labs Bolt T-Shirt", "Sauce Labs Fleece Jacket" and hardcoded "Test.allTheThings() T-Shirt (Red)"

## Test Conditions
- Browser: Chrome
- Test user: problem_user / secret_sauce
- Environment: QA

## Preconditions
None

## Steps to Reproduce
1. Login
2. Open the Product Catalog page and locate a product in the second row.
3. Attempt to add that product to the Cart.

## Result
Add-to-Cart action does not work for some items in Product Catalog

## Attachments
- Screenshot(s): ![Items prevented from being added to Cart](<./ss_itemsPreventedFromBeingAddedToCart.png>)
