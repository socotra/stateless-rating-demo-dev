const { executeLambda } = require('../src/config/scripts/lambda/lambda');
const { policyRequestNoIndemnity, 
    policyRequestMediumIndemnity, policyRequestHighIndemnity } = require('./utils');

test('lambda returns three priced policy results for an array of three creation requests', () => {
    const lambdaResult = executeLambda('getStatelessRating', 
        { policies: [ policyRequestNoIndemnity, policyRequestMediumIndemnity, policyRequestHighIndemnity ]});
    const [noIndemnityPricedPolicyResponse, 
           mediumIndemnityPricedPolicyResponse, 
           highIndemnityPricedPolicyResponse ] = lambdaResult;
    
    // checking `PolicyResponse.grossPremium`
    expect(noIndemnityPricedPolicyResponse.characteristics[0].grossPremium).toBe('133');
    expect(mediumIndemnityPricedPolicyResponse.characteristics[0].grossPremium).toBe('1133');
    expect(highIndemnityPricedPolicyResponse.characteristics[0].grossPremium).toBe('5133');

    // checking characteristic exposures pricing
    const noIndemnityPerilChar = noIndemnityPricedPolicyResponse.exposures[0].perils[0].characteristics[0];
    expect(noIndemnityPerilChar.premium).toBe('133');

    const mediumIndemnityPerilChar = mediumIndemnityPricedPolicyResponse.exposures[0].perils[0].characteristics[0];
    expect(mediumIndemnityPerilChar.premium).toBe('1133');

    const highIndemnityPerilChar = highIndemnityPricedPolicyResponse.exposures[0].perils[0].characteristics[0];
    expect(highIndemnityPerilChar.premium).toBe('5133');
});