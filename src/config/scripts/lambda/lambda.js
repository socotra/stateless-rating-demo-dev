const { BuildSocotraPolicy } = require('../main/lib/BuildSocotraPolicy.js');
const { getPerilRates } = require('../main/rater.js');

function executeLambda(operation, payload) {
    switch(operation) {
        case 'getStatelessRating':
            const bsp = new BuildSocotraPolicy();
            return payload.policies.map(cr => getPerilRates(
                { policy: bsp.getPolicy(cr) }));
        default:
            throw `Unrecognized operation passed to lambda: ${operation}`;
    }
}

exports.executeLambda = executeLambda;