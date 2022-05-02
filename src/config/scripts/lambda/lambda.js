const { BuildSocotraPolicy } = require('../main/lib/BuildSocotraPolicy.js');
const { getPerilRates } = require('../main/rater.js');

function getPricedPolicyResponse(policyResponse) {
    const { pricedPerilCharacteristics } = getPerilRates({ policy: policyResponse });

    // We'll decorate the policy response with `grossPremium` at the 
    // policy characteristics level and with the requisite premium properties
    // for each of the peril characteristics
    let grossPremium = 0;
    
    // Since our demo rater only returns exact premium in the price response,
    // we will simply write it as `premium` in our PolicyResponse. Note that if your production rater
    // supplies different premium rating attributes, and/or you want different premium attributes in your
    // decorated `PolicyResponse`, you should update this logic accordingly.
    for (let exposure of policyResponse.exposures) {
        for (let peril of exposure.perils) {
            for (let perilCharacteristic of peril.characteristics) {
                let pricedData = pricedPerilCharacteristics[perilCharacteristic.locator];
                if (pricedData != undefined) {
                    const exactPremium = pricedData.exactPremium;
                    perilCharacteristic.premium = exactPremium;
                    grossPremium += parseInt(exactPremium);
                }
            }
        }
    }

    policyResponse.characteristics[0].grossPremium = grossPremium.toString();
    return policyResponse;
}

function executeLambda(operation, payload) {
    switch(operation) {
        case 'getStatelessRating':
            const bsp = new BuildSocotraPolicy();
            return payload.policies.map(cr => getPricedPolicyResponse(bsp.getPolicy(cr)));
        default:
            throw `Unrecognized operation passed to lambda: ${operation}`;
    }
}

exports.executeLambda = executeLambda;