const { executeLambda } = require('../src/config/scripts/lambda/lambda');
const { policyRequestNoIndemnity, 
    policyRequestMediumIndemnity, policyRequestHighIndemnity } = require('./utils');

test('lambda returns three pricing results for an array of creation requests', () => {
    const lambdaResult = executeLambda('getStatelessRating', 
        { policies: [ policyRequestNoIndemnity, policyRequestMediumIndemnity, policyRequestHighIndemnity ]});
    const [noIndemnityResult, mediumIndemnityResult, highIndemnityResult ] = lambdaResult;
    const noIndemnityPriceData = Object.entries(noIndemnityResult.pricedPerilCharacteristics)[0][1];
    const mediumIndemnityPriceData = Object.entries(mediumIndemnityResult.pricedPerilCharacteristics)[0][1];
    const highIndemnityPriceData = Object.entries(highIndemnityResult.pricedPerilCharacteristics)[0][1];

    expect(noIndemnityPriceData.yearlyPremium).toBe('133');
    expect(mediumIndemnityPriceData.yearlyPremium).toBe('1133');
    expect(highIndemnityPriceData.yearlyPremium).toBe('5133');
});