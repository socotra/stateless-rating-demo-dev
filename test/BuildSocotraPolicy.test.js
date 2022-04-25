const { BuildSocotraPolicy } = require('../src/config/scripts/main/lib/BuildSocotraPolicy');
const { policyRequestNoIndemnity, 
    policyRequestMediumIndemnity, policyRequestHighIndemnity } = require('./utils');

test('service returns a reasonable policy response', () => {
    const bsp = new BuildSocotraPolicy();
    const mockPolicyNoIndemnityPolicyResponse = bsp.getPolicy(policyRequestNoIndemnity);
    const mockPolicyMediumIndemnityPolicyResponse = bsp.getPolicy(policyRequestMediumIndemnity);
    const mockPolicyHighIndemnityPolicyResponse = bsp.getPolicy(policyRequestHighIndemnity);

    // perform some selective checks on our set to ensure presence of expected properties,
    // especially for attributes relevant to the rater
    expect(mockPolicyNoIndemnityPolicyResponse).toHaveProperty('productName', 'personal-auto');
    expect(mockPolicyNoIndemnityPolicyResponse).toHaveProperty('exposures[0].perils[0].name', 'a_third_party_liability');
    expect(mockPolicyNoIndemnityPolicyResponse).toHaveProperty('exposures[0].perils[0].characteristics[0].indemnityInAggregate', '0');
    expect(mockPolicyNoIndemnityPolicyResponse).toHaveProperty('exposures[0].characteristics[0].fieldValues.vehicle_type[0]', 'Car');

    expect(mockPolicyMediumIndemnityPolicyResponse).toHaveProperty('productName', 'personal-auto');
    expect(mockPolicyMediumIndemnityPolicyResponse).toHaveProperty('exposures[0].perils[0].name', 'a_third_party_liability');
    expect(mockPolicyMediumIndemnityPolicyResponse).toHaveProperty('exposures[0].perils[0].characteristics[0].indemnityInAggregate', '20000');
    expect(mockPolicyMediumIndemnityPolicyResponse).toHaveProperty('exposures[0].characteristics[0].fieldValues.vehicle_type[0]', 'Car');

    expect(mockPolicyHighIndemnityPolicyResponse).toHaveProperty('productName', 'personal-auto');
    expect(mockPolicyHighIndemnityPolicyResponse).toHaveProperty('exposures[0].perils[0].name', 'a_third_party_liability');
    expect(mockPolicyHighIndemnityPolicyResponse).toHaveProperty('exposures[0].perils[0].characteristics[0].indemnityInAggregate', '100000');
    expect(mockPolicyHighIndemnityPolicyResponse).toHaveProperty('exposures[0].characteristics[0].fieldValues.vehicle_type[0]', 'Car');
});