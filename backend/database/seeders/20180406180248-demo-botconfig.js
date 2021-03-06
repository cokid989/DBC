/** to generate random int in range(0, maxValue) / maxValue, to get a nice predictable decimal place
 *    for example randomizeValue(10) returns either 0.1,0.2,0.3,...0.9,1.0
 */
function randomizeValue(maxValue) {
    return Math.round(Math.random() * maxValue) / maxValue;
}

module.exports = {
    up: (queryInterface) => {
        /**
          *  Add altering commands here.
          *  Return a promise to correctly handle asynchronicity.
          */
        const configs = [];
        for (let i = 1; i < 26; i += 1) {
            const configurationDetails = {
                teamDesires: {
                    defend: {
                        top: randomizeValue(10),
                        mid: randomizeValue(10),
                        bot: randomizeValue(10),
                    },
                    push: {
                        top: randomizeValue(10),
                        mid: randomizeValue(10),
                        bot: randomizeValue(10),
                    },
                    roam: randomizeValue(10),
                    roshan: randomizeValue(10),
                },
            };

            configs.push({
                name: `Test real ${i}`,
                description: 'This bot was seeded into the database',
                title: `Test bot ${i}`,
                configuration: JSON.stringify(configurationDetails),
                userId: 'auth0|5aaad1a6aa9ad130c17479ba',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        return queryInterface.bulkInsert('BotConfigs', configs, {});
    },
    down: queryInterface => queryInterface.bulkDelete('BotConfigs', null, {}),
};
