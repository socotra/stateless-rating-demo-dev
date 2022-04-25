const fs = require('fs');

const FIXTURES_PATH = './test/fixtures';

function getDataForJsonFile(filename) {
    return JSON.parse(fs.readFileSync(`${FIXTURES_PATH}/${filename}`));
}

const policyRequestNoIndemnity = getDataForJsonFile('PolicyNoIndemnity.json');
const policyRequestMediumIndemnity = getDataForJsonFile('PolicyMediumIndemnity.json');
const policyRequestHighIndemnity = getDataForJsonFile('PolicyHighIndemnity.json');

module.exports = {
    policyRequestNoIndemnity,
    policyRequestMediumIndemnity,
    policyRequestHighIndemnity
}