export const config: CodeceptJS.MainConfig = {
  tests: './tests/restful_booker_test.ts',
  output: './output',
  helpers: {
    REST: {
      endpoint: 'https://restful-booker.herokuapp.com',
      defaultHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
    JSONResponse: {},
  },
  plugins: {
    htmlReporter: {
      enabled: true,
    },
  },
  name: 'cdcpt-boilerplate-api',
};
