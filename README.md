# CDCPT Boilerplate

This CodeceptJS project contains the `Test SauceDemo Website` scenario and page-object samples. The `utils` folder is retained for future demos.

## Setup

1. Install dependencies with `npm install`.
2. Set `TOOLBOX_USERNAME` and `TOOLBOX_PASSWORD` in the environment.
3. Set `TOOLBOX_URL` to the Toolbox login entry URL when the default URL is
   not suitable.
4. Set `file_batch_name` in `config/constants.json` to the workbook name in
   `config/` (without the `.xlsx` extension).

Run the scenario with:

```sh
npx codeceptjs run tests/toolbox_migration_checks_test.ts --steps
```

The scenario writes its site-check results to `output/`.

## Defect tracking

The `defect_tracking/` folder contains `bug_template.MD`, individual Markdown
reports describing reported defects, and supporting evidence such as
screenshots and a screen recording. Reports capture the available context,
reproduction steps, observed behavior, and notes. Evidence is linked from the
relevant report using relative paths within the folder.
