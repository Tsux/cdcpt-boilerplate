# Bug: Sauce Labs Fleece Jacket is not found and is not added to Cart

## Summary
The Sauce Labs Fleece Jacket product leads to a “Not Found Item” page and cannot be added to the Cart.

## Test Conditions
- Browser: Chrome
- Test user: problem_user / secret_sauce
- Environment: QA

## Preconditions
None

## Steps to Reproduce
1. {{ Login }}
2. Open the Product Catalog page and select Sauce Labs Fleece Jacket.
3. Attempt to add the product to the Cart and check the Cart.

## Result
The product leads to a “Not Found Item” page. Its “Add to Cart” button is tappable and changes to “Remove”, but the product is not added to the Cart.

## Attachments
- Screenshot(s): ![Item not found](<./ss_itemNotFoundMisbehavior.png>)

## Notes / Additional Info
Hypothesis / investigation notes: Might be related to cross-linked product details issue, wrong Catalog screen population or corrupted links data
