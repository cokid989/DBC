// const path = require('path');
// process.env.NODE_PATH = path.join(__dirname, '..');
// require('module').Module._initPaths();
const { writeScripts, shouldRegenerateBotScripts } = require('./generateScript.js');
const mocks = require('node-mocks-http');

const items = ['item_slippers',
    'item_circlet',
    'item_recipe_wraith_band',
    'item_tango'];

const input = {
    abilities: 'qweqqrewqetnqrnt',
    talents: ['l', 'r', 'l', 'l'],
};
// const heroes1 = {
//     partitioned: false,
//     pool: [
//         {
//             name: 'drow_ranger',
//             position: -1,
//         },
//         {
//             name: 'bane',
//             position: -1,
//         },
//         {
//             name: 'alchemist',
//             position: -1,
//         },
//         {
//             name: 'abaddon',
//             position: -1,
//         },
//         {
//             name: 'antimage',
//             position: -1,
//         },
//         {
//             name: 'axe',
//             position: -1,
//         },
//         {
//             name: 'bloodseeker',
//             position: -1,
//         },
//         {
//             name: 'centaur',
//             position: -1,
//         },
//         {
//             name: 'chen',
//             position: -1,
//         },
//         {
//             name: 'chaos_knight',
//             position: -1,
//         },
//         {
//             name: 'crystal_maiden',
//             position: -1,
//         },
//     ],
// };
const heroes2 = {
    partitioned: true,
    pool: [
        {
            name: 'drow_ranger',
            position: 1,
        },
        {
            name: 'bane',
            position: 1,
        },
        {
            name: 'alchemist',
            position: 1,
        },
        {
            name: 'abaddon',
            position: 2,
        },
        {
            name: 'antimage',
            position: 2,
        },
        {
            name: 'axe',
            position: 3,
        },
        {
            name: 'bloodseeker',
            position: 3,
        },
        {
            name: 'centaur',
            position: 4,
        },
        {
            name: 'chen',
            position: 4,
        },
        {
            name: 'chaos_knight',
            position: 5,
        },
        {
            name: 'crystal_maiden',
            position: 5,
        },
    ],
};
const configObject = {
    heroPool: heroes2,
    heroes: [
        {
            name: 'drow_ranger',
            abilities: input,
            items,
        },
        {
            name: 'chen',
            abilities: input,
            items,
        },
        {
            name: 'crystal_maiden',
            abilities: null,
            input: null,
        },
        {
            name: 'chaos_knight',
        },
        {
            name: 'centaur',
        },
        {
            name: 'chen',
        },
        {
            name: 'bloodseeker',
        },
        {
            name: 'antimage',
        },
        {
            name: 'abaddon',
        },
        {
            name: 'alchemist',
        },
        {
            name: 'bane',
        },
    ],
    desires: {
        push: {
            top: {
                conditions: [],
                logicalOperator: [],
                compoundConditions: [],
                initialValue: 0.5,
            },
            mid: {
                conditions: [],
                logicalOperator: [],
                compoundConditions: [],
                initialValue: 0.5,
            },
            bot: {
                conditions: [],
                logicalOperator: [],
                compoundConditions: [],
                initialValue: 0.5,
            },
        },
        farm: {
            top: {
                conditions: [],
                logicalOperator: [],
                compoundConditions: [],
                initialValue: 0.5,
            },
            mid: {
                conditions: [],
                logicalOperator: [],
                compoundConditions: [],
                initialValue: 0.5,
            },
            bot: {
                conditions: [],
                logicalOperator: [],
                compoundConditions: [],
                initialValue: 0.5,
            },
        },
        defend: {
            top: {
                conditions: [],
                logicalOperator: [],
                compoundConditions: [],
                initialValue: 0.5,
            },
            mid: {
                conditions: [],
                logicalOperator: [],
                compoundConditions: [],
                initialValue: 0.5,
            },
            bot: {
                conditions: [],
                logicalOperator: [],
                compoundConditions: [],
                initialValue: 0.5,
            },
        },
        roam: {
            conditions: [],
            logicalOperator: [],
            compoundConditions: [],
            initialValue: 0.5,
        },
        roshan: {
            conditions: [],
            logicalOperator: [],
            compoundConditions: [],
            initialValue: 0.5,
        },
    },
    name: 'yay',
    description: 'boo',
};
const officialRequest = {
    body: {
        configuration: configObject,
    },
};

writeScripts(officialRequest, mocks.createResponse(), 'LOL', 69);
shouldRegenerateBotScripts('LOL', 69);
