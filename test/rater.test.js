const { getPerilRates } = require('../src/config/scripts/main/rater');
const { BuildSocotraPolicy } = require('../src/config/scripts/main/lib/BuildSocotraPolicy');
const { policyRequestNoIndemnity, 
    policyRequestMediumIndemnity, policyRequestHighIndemnity } = require('./utils');


function getRaterResultsForRequest(request) {
    const bsp = new BuildSocotraPolicy();
    return getPerilRates({ policy: bsp.getPolicy(request) });
}

test('rater returns expected result for no indemnity', () => {
    const raterResults = getRaterResultsForRequest(policyRequestNoIndemnity);
    const priceData = Object.entries(raterResults.pricedPerilCharacteristics)[0][1];
    expect(priceData.yearlyPremium).toBe('133');
});

test('rater returns expected result for medium indemnity', () => {
    const raterResults = getRaterResultsForRequest(policyRequestMediumIndemnity);
    const priceData = Object.entries(raterResults.pricedPerilCharacteristics)[0][1];
    expect(priceData.yearlyPremium).toBe('1133');
});

test('rater returns expected result for high indemnity', () => {
    const raterResults = getRaterResultsForRequest(policyRequestHighIndemnity);
    const priceData = Object.entries(raterResults.pricedPerilCharacteristics)[0][1];
    expect(priceData.yearlyPremium).toBe('5133');
});