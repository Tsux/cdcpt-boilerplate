# Bug: Product quantity cannot be updated in Cart page

## Summary
Users are unable to update a product quantity in the Cart (for example, from 1 to 2).

## Test Conditions
- Browser: Chrome
- Test user: standard_user / secret_sauce
- Environment: QA

## Preconditions
None

## Steps to Reproduce
1. Login
2. Add a product to the Cart.
3. Go to Cart
4. Attempt to change its quantity from 1 to 2.

## Result
The product quantity cannot be updated, closed for manual edit

## Notes / Additional Info
Reported as a generic issue, not limited to `problem_user` experience.
Hypothesis / investigation notes: Needs to be verified with PO to discard such behavior being by-design
