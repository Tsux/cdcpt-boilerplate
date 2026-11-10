# Bug: Product links open the wrong Product Details page

## Summary
Product links on the Product Catalog page can open a Product Details page for a different product.

## Test Conditions
- Browser: Chrome
- Test user: problem_user / secret_sauce
- Environment: QA

## Preconditions
None

## Steps to Reproduce
1. Login
2. Open the Product Catalog page.
3. Tap a product card and compare the product with the Product Details page that opens.

## Result
A product can lead to the wrong Product Details page. One reported example opens the Sauce Labs Onesie details page; the product selected for that example was not specified.

## Notes / Additional Info
Some samples below:
* "Sauce Labs Backpack" leads to "Sauce Labs Fleece Jacket"
* "Sauce Labs Bolt T-Shirt" leads to “Sauce Labs Onesie”.

Hypothesis / investigation notes: Possibly a problem with the Catalog page population
