# Stateless Rating Demo

## Getting Started

### Deploying to a (non-production) tenant

1. Zip up the `config` directory under `src` and deploy it to your tenant
1. Post a [lambda request](https://docs.socotra.com/production/api/lambda.html) to the tenant with operation `getStatelessRating` and an array of [PolicyCreationRequest](https://docs.socotra.com/production/api/policy.html#PolicyCreateRequest) objects. You can generate a full request from test fixtures with simple `npm` commands, detailed below.

### Testing locally and developing for production deployment

This demo repository is structured to exhibit the following properties:
* You can modify the contents of the `config` directory directly and do not need to use any third-party libraries or build steps for deployment.
* Tests...
  * are optional but recommended.
  * exist outside of `config` but exercise `config` components.
  * employ popular third-party libraries (e.g. `jest`) and may leverage JavaScript features unavailable to plugin scripts.

Note, then, that you can use this demo as the basis for a stateless rating implementation without using any JavaScript/Node tooling. If you would like to leverage automated tests or build your lamba requests directly from `fixtures`,

1. Ensure a recent version of Node is installed (e.g. LTS 16.x)
1. Run `npm install` from the root directory of this repository
1. Execute `npm run test` to run tests
1. Execute `npm run-script makeLambdaRequest` to generate a lambda request body based on test fixtures. By default, the generated request body will be available in the `test` directory as `lambdaRequestBody.json`

You can further develop the provided tests in tandem with any modifications to the essential components (`BuildSocotraPolicy`, `lambda`, `rater`) to help ensure that your deployment will work as expected. For example, if you wanted to use this demo repository as the basis for your own stateless rating implementation, you can follow this procedure:

1. Place your expected policy request variants as separate files in `test/fixtures`
1. Update `test/utils.js` to ensure that it exports the JSON for your creation request file(s) in `test/fixtures`
1. Update tests in `test/BuildSocotraPolicy.test.js` to affirm that its `getPolicy` method returns a `PolicyResponse` object with all the attributes that are relevant to your production rater's logic. 
    1. Iterate on updates to `BuildSocotraPolicy` and the corresponding `BuildSocotraPolicy.test.js` until you are confident that the component is producing the `PolicyResponse` you need for your expected policy creation variants.
    1. Note that you can run just the BuildSocotraPolicy test by running `npx jest BuildSocotraPolicy`.
1. Swap out this demo's `rater.js` with your production rater. Update `rater.test.js` to inspect results and ensure that your rater returns values you expect for your policy creation test variations. If you find that your `rater.js` requires updates, make sure that any such changes do not conflict with established requirements.
1. Update `lambda.test.js` to ensure that it, too, yields the expected pricing results corresponding to your array of `PolicyCreationRequest` objects.
1. Copy your completed components (`lambda.js`, `BuildSocotraPolicy.js`, and, if updated, `rater.js`) to your production configuration set for deployment to a staging tenant. If your configuration has an existing `lambda.js`, simply add the requisite logic (script imports, operation) from this repository's `lambda.js` to it.
1. Test your stateless rater in a staging tenant by issuing an API request against it. You can update the `./test/makeLambdaRequest.js` utility to generate a request body from your test fixtures.