const PERIL_NAME_FACTORS = {
    "bodily_injury": 0.7,
    "a_third_party_liability": 0.3
}

const VEHICLE_TYPE_FACTORS = {
    "Car": 1.2,
    "SUV": 1.3,
    "Motorcyle": 2
}

const VEHICLE_VALUE_FACTOR = 0.037;

const VEHICLE_FACTOR_TABLE_NAME = 'vehicle_rate_table_personal_auto';

function getPerilRates(data) {
    /**
     * A verbose peril rates implementation that matches the functionality provided by the 
     * simple auto rate calculation (bodily injury + third party at peril level)
     * 
     * For instructional purposes, uses no convenience libraries
     */
    const exposurePerils = data.policyExposurePerils;
    const policy = data.policy;

    /** 
     * To price, we are considering
     *      vehicle type    (exposure-level char)z
     *      vehicle value   (exposure-level char)
     *      sales channel   (policy-level characteristics)
     *      peril type
     */

    // Part I: look up required data for our pricing
    let exposureChar = policy.exposures[0].characteristics[0];

    const vehicleType = exposureChar.fieldValues.vehicle_type;
    const vehicleValue = exposureChar.fieldValues.vehicle_value;

    console.log(`Vehicle type was ${vehicleType}`);
    console.log(`Vehicle value was ${vehicleValue}`);


    // Perform a table lookup
    let vehicleTypeFactor = VEHICLE_TYPE_FACTORS[vehicleType];

    if (vehicleTypeFactor === undefined) {
        throw `StartUIerror Could not retrieve matching factor for ${vehicleType} in ${VEHICLE_FACTOR_TABLE_NAME} EndUIerror`;
    }

    console.log(`Vehicle type factor is ${vehicleTypeFactor}`);

    // now get the indemnity in aggregate amount
    // for demo purposes, just going to use the one peril we are expecting for new business
    let peril = policy.exposures[0].perils[0];
    let perilName = peril.name;
    let perilCharacteristics = peril.characteristics[0];

    // assume (optional) indemnity is defined
    let indemnityInAggregate = parseInt(perilCharacteristics.indemnityInAggregate);
    
    let perilCharacteristicsLocator = perilCharacteristics.locator;

    let prem = Math.round((parseInt(vehicleValue) * VEHICLE_VALUE_FACTOR));
    prem = Math.round(prem * parseInt(vehicleTypeFactor));
    prem = Math.round(prem * PERIL_NAME_FACTORS[perilName]);
    prem = Math.round(prem + (indemnityInAggregate * 0.05));

    console.log(`1. Calculated premium was ${prem}`);

    let pricingResult = {}
    pricingResult[perilCharacteristicsLocator] = {
        yearlyPremium: '' + prem
    }

    return {
        pricedPerilCharacteristics: pricingResult
    }
}

exports.getPerilRates = getPerilRates;