const fs = require('fs');
const process = require('process');

const outFileName = process.argv[2];
if (outFileName === undefined) {
    console.error('You must supply an output filename');
    process.exit(1);
}

const { policyRequestNoIndemnity, 
    policyRequestMediumIndemnity, policyRequestHighIndemnity } = require('./utils');

const lambdaRequestBody = {
    'operation': 'getStatelessRating',
    'payload': {
        'policies': [policyRequestNoIndemnity, policyRequestMediumIndemnity, policyRequestHighIndemnity]
    }
}

fs.writeFileSync(outFileName, JSON.stringify(lambdaRequestBody));