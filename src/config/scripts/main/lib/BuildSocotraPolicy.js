/*
  This class provides a method to convert a Socotra policy create request
  in into a policy response as would be returned by the platform proper
*/

const DEFAULT_CURRENCY = "USD";
const DEFAULT_GROSS_FEES = "0.00";
const DEFAULT_PAYMENT_SCHEDULE_NAME = "upfront";
const DEFAULT_CONFIG_VERSION = 0;
const DEFAULT_INDEMNITY_IN_AGGREGATE = "50000";

class BuildSocotraPolicy
{
    getPolicy(policyRequest)
    {
        //Create the required randos
        this._lastDisplayId = 100000000;
        const policyLocator = this._getDisplayId()
        const productLocator = this._getRandomUuid();
        const policyCharacteristicsLocator = this._getRandomUuid();
        const createdTimestamp = new Date().valueOf().toString();
        const policyStartTimestamp = this._getOriginalContractStartTimestamp(policyRequest);
        const policyEndTimestamp = this._getOriginalContractEndTimestamp(policyRequest, policyStartTimestamp);

        const policy = {
            locator: policyLocator,
            displayId : policyLocator,
            originalContractStartTimestamp: policyStartTimestamp,
            originalContractEndTimestamp: policyEndTimestamp,
            effectiveContractEndTimestamp: policyEndTimestamp,
            characteristics: [
                {
                    locator : policyCharacteristicsLocator,
                    policyLocator : policyLocator,
                    productName : policyRequest.productName,
                    startTimestamp : policyStartTimestamp,
                    endTimestamp : policyEndTimestamp,
                    policyEndTimestamp : policyEndTimestamp,
                    policyStartTimestamp : policyStartTimestamp,
                    grossPremiumCurrency: DEFAULT_CURRENCY,
                    taxGroups: [],
                    grossTaxesCurrency: DEFAULT_CURRENCY,
                    mediaByLocator: {},
                    policyholderLocator : policyRequest.policyholderLocator,
                    productLocator:  productLocator,
                    createdTimestamp : createdTimestamp,
                    updatedTimestamp : createdTimestamp,
                    ...this._getFieldValuesAndGroups(policyRequest)
                }
            ],
            fees: [],
            grossFees: DEFAULT_GROSS_FEES,
            grossFeesCurrency: DEFAULT_CURRENCY,
            documents: [],
            invoices: [],
            paymentScheduleName: policyRequest.paymentScheduleName || DEFAULT_PAYMENT_SCHEDULE_NAME,
            policyholderLocator : policyRequest.policyholderLocator,
            productLocator:  productLocator,
            productName : policyRequest.productName,
            createdTimestamp : createdTimestamp,
            updatedTimestamp : createdTimestamp,
            configVersion : policyRequest.configVersion || DEFAULT_CONFIG_VERSION
        }
        policy.exposures = this._getPolicyExposures(policyRequest, policy);
        policy.modifications = this._getPolicyModifications(policy);
        
        return policy;
    }
    _getRandomUuid() 
    {
        const randomByte = () => Math.floor(Math.random() * 256);
        const mask = (byte, index) => {
            if (index === 6) byte = (byte & 0x0F) | 0x40;
            if (index === 8) byte = (byte & 0x3F) | 0x80;
            const hex = byte.toString(16);
            return hex.length < 2 ? '0' + hex : hex;
        };
        // each UUIDv4 has 8*16=128 bits of entropy
        // (minus some fixed locations, see RFC 4122)
        const bytes = Array.from({ length: 16 }, randomByte)
        const chars = Array.from(bytes, mask).join('')
        return [
            chars.slice( 0,  8),
            chars.slice( 8, 12),
            chars.slice(12, 16),
            chars.slice(16, 20),
            chars.slice(20, 32),
          ].join('-')
    }
    _getDisplayId()
    {
        return (this._lastDisplayId++).toString();
    }
    _getOriginalContractStartTimestamp(policyRequest)
    {
        if (policyRequest.policyStartTimestamp)
        {
            return policyRequest.policyStartTimestamp.toString();
        }
        else
        {
            let d = new Date();
            return d.setHours(0,0,0,0).toString();
        }
    }
    _getOriginalContractEndTimestamp(policyRequest, policyStartTimestamp)
    {
        return (policyRequest.policyEndTimestamp || (parseInt(policyStartTimestamp) + 365 * 24 * 60 * 60 * 1000)).toString();
    }
    // policyObject is a Policy, Exposure or Peril
    _getFieldValuesAndGroups(policyObject)
    {
        const fieldValuesAndGroups = {
            fieldValues: this._getFieldValues(policyObject.fieldValues),
            fieldGroupsByLocator: {}
        };
        for (const fieldGroup of (policyObject.fieldGroups || []))
        {
            const fieldGroupLocator = this._getRandomUuid();
            if (!fieldValuesAndGroups.fieldValues[fieldGroup.fieldName])
                fieldValuesAndGroups.fieldValues[fieldGroup.fieldName] = [];
            fieldValuesAndGroups.fieldValues[fieldGroup.fieldName].push(fieldGroupLocator);
            fieldValuesAndGroups.fieldGroupsByLocator[fieldGroupLocator] = this._getFieldValues(fieldGroup.fieldValues);
        }
        return fieldValuesAndGroups;
    }
    _getFieldValues(fieldValuesObject)
    {
        const fieldValuesMap = {};
        for (const property in fieldValuesObject) {
            let value = fieldValuesObject[property];
            if (!(value instanceof Array))
                value = [value.toString()];
            fieldValuesMap[property] = value;
        }
        return fieldValuesMap;
    }
    _getPolicyExposures(policyCreateRequest, policy)
    {
        let policyExposures = [];
        for (const expReq of policyCreateRequest.exposures)
        {
            const exp = {
                locator: this._getRandomUuid(),
                name: expReq.exposureName,
                displayId: this._getDisplayId(),
                policyholderLocator: policy.policyholderLocator,
                productLocator: policy.productLocator,
                policyLocator: policy.locator,
                createdTimestamp: policy.createdTimestamp,
                updatedTimestamp: policy.createdTimestamp,
            };
            exp.characteristics = this._getExposureCharacteristics(expReq, exp, policy);
            exp.perils = this._getExposurePerils(expReq, exp, policy);
            policyExposures.push(exp);
        }
        return policyExposures;
    }
    _getExposureCharacteristics(expReq, exposure, policy)
    {
        return [{
            locator : this._getRandomUuid(),
            exposureLocator: exposure.locator,
            startTimestamp: policy.originalContractStartTimestamp,
            endTimestamp: policy.originalContractEndTimestamp,
            mediaByLocator: {},
            policyholderLocator: policy.policyholderLocator,
            productLocator: policy.productLocator,
            policyLocator: policy.locator,
            createdTimestamp: policy.createdTimestamp,
            updatedTimestamp: policy.createdTimestamp,
            ...this._getFieldValuesAndGroups(expReq)
        }];
    }
    _getExposurePerils(exposureCreateRequest, exposure, policy)
    {
        const exposurePerils = [];
        for (const perilReq of exposureCreateRequest.perils)
        {
            exposurePerils.push({
                locator: this._getRandomUuid,
                displayId: this._getDisplayId(),
                name: perilReq.name,
                exposureLocator: exposure.locator,
                renewalGroup: this._getDisplayId(),
                characteristics: this._getPerilCharacteristics(perilReq, exposure, policy),
                policyholderLocator: policy.policyholderLocator,
                productLocator: policy.productLocator,
                policyLocator: policy.locator,
                createdTimestamp: policy.createdTimestamp,
                updatedTimestamp: policy.createdTimestamp
            });
        }
        return exposurePerils;
    } 
    _getPerilCharacteristics(perilCreateRequest, exposure, policy)
    {
        return [{
            locator: this._getRandomUuid(),
            policyholderLocator: policy.policyholderLocator,
            productLocator: policy.productLocator,
            policyLocator: policy.locator,
            policyCharacteristicsLocator: policy.characteristics[0].locator,
            exposureCharacteristicsLocator: exposure.characteristics[0].locator,
            createdTimestamp: policy.createdTimestamp,
            updatedTimestamp: policy.createdTimestamp,
            coverageStartTimestamp: policy.originalContractStartTimestamp,
            coverageEndTimestamp: policy.originalContractEndTimestamp,
            deductibleCurrency: DEFAULT_CURRENCY,
            indemnityInAggregateCurrency: DEFAULT_CURRENCY,
            indemnityPerEventCurrency: DEFAULT_CURRENCY,
            indemnityPerItemCurrency: DEFAULT_CURRENCY,
            lumpSumPaymentCurrency: DEFAULT_CURRENCY,
            mediaByLocator: {},
            perilLocator: perilCreateRequest.locator,
            policyModificationLocator: "someLocator",
            premiumCurrency:  DEFAULT_CURRENCY,
            indemnityInAggregate: perilCreateRequest.indemnityInAggregate || DEFAULT_INDEMNITY_IN_AGGREGATE,
            ...this._getFieldValuesAndGroups(perilCreateRequest)
        }];
    }
    _getPolicyModifications(policyResponse)
    {
        const policyMod = {
            locator: this._getRandomUuid(),
            name: "modification.policy.create",
            displayId: this._getDisplayId(),
            number: 0,
            effectiveTimestamp: policyResponse.originalContractStartTimestamp,
            fieldValues: {},
            fieldGroupsByLocator: {},
            mediaByLocator: {},
            newPolicyCharacteristicsLocator: policyResponse.characteristics[0].locator,
            newPolicyCharacteristicsLocators: [policyResponse.characteristics[0].locator],
            premiumChangeCurrency: DEFAULT_CURRENCY,
            policyholderLocator: policyResponse.policyholderLocator,
            productLocator: policyResponse.productLocator,
            policyLocator: policyResponse.locator,
            createdTimestamp: policyResponse.createdTimestamp,
            updatedTimestamp: policyResponse.createdTimestamp,
            configVersion: policyResponse.configVersion
        };
        policyMod.exposureModifications = this._getExposureModifications(policyResponse, policyMod);
            
        return [policyMod];
    }
    _getExposureModifications(policyResponse, policyModification)
    {
        const exposureModifications = [];
        for (const exposure of policyResponse.exposures)
        {
            const exposureModificationLocator = this._getRandomUuid();
            let exposureModification = {
                locator: exposureModificationLocator,
                policyModificationLocator: policyModification.locator,
                exposureLocator: exposure.locator,
                newExposureCharacteristicsLocator: exposure.characteristics[0].locator,
                policyholderLocator: policyResponse.policyholderLocator,
                productLocator: policyResponse.productLocator,
                policyLocator: policyResponse.locator
            };
            exposureModification.perilModifications = this._getExposurePerilModifications(exposure, policyResponse, exposureModification);
            exposureModifications.push(exposureModification);
        }
        return exposureModifications;
    }
    _getExposurePerilModifications(exposure, policy, exposureModification)
    {
        return exposure.perils.map(peril => ({
            locator: this._getRandomUuid(),
            perilLocator: peril.locator,
            exposureModificationLocator: exposureModification.locator,
            newPerilCharacteristicsLocator: peril.characteristics[0].locator,
            premiumChangeCurrency: DEFAULT_CURRENCY,
            policyholderLocator: policy.policyholderLocator,
            productLocator: policy.productLocator,
            policyLocator: policy.policyLocator
        }));
    }
}

exports.BuildSocotraPolicy = BuildSocotraPolicy;