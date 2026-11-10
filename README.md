# CDCPT Boilerplate

This CodeceptJS project contains separate Playwright UI and REST API tests. The `utils` folder is retained for future demos.

## Setup

Install the project dependencies:

```sh
npm install
```

## Playwright UI tests

The UI tests use [codecept.conf.ts](./codecept.conf.ts), which configures the
Playwright helper. Set the credentials expected by the test in your shell:

```sh
export TOOLBOX_USERNAME='standard_user'
export TOOLBOX_PASSWORD='secret_sauce'
```

Run the SauceDemo UI test:

```sh
npx codeceptjs run tests/saucedemo_test.ts --steps
```

## REST API tests

The REST tests use [codecept.api.conf.ts](./codecept.api.conf.ts), which
configures the REST and JSONResponse helpers without starting a browser. The
configuration currently targets the Restful Booker API.

Run the REST API test separately:

```sh
npx codeceptjs run -c codecept.api.conf.ts --steps
```

The API config selects `tests/restful_booker_test.ts`. To run only the booking
life-cycle scenario instead of the full API test suite, use:

```sh
npx codeceptjs run -c codecept.api.conf.ts --steps \
  --grep 'Create a new booking, update and delete'
```

Both test configurations write reports and other run output to `output/`.

## Defect tracking

The `defect_tracking/` folder contains `bug_template.MD`, individual Markdown
reports describing reported defects, and supporting evidence such as
screenshots and a screen recording. Reports capture the available context,
reproduction steps, observed behavior, and notes. Evidence is linked from the
relevant report using relative paths within the folder.
