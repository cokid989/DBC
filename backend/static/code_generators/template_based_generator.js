/**
* Expected input: JSON Object { abilities: "qweqqrewqet", talents: ['l','r','l','l']}
*
*   q, w, e, r refer to the ability bound keys t refers to an appropriate talent,
*   n refers to no ability
*   l,r refer to left and right for the talent tree
*/
const LEFT = 1;
const RIGHT = 2;

// Note: this relative to root dir
const PATH_TO_CODE_DUMP = path.join('backend', 'static', 'code_generators', 'code_dump');
const PATH_TO_SCRIPTS = path.join('backend', 'static', 'scripts');
const PATH_TO_TEMPLATE_SCRIPTS = path.join('backend', 'static', 'scripts', 'code_templates');
const ABILITY_TEMPLATE_FOLDER_NAME = 'ability_templates';
const ITEM_TEMPLATE_FOLDER_NAME = 'item_templates';
const HERO_SELECT_TEMPLATE_FOLDER_NAME = 'hero_selection_template';

let fs = require('fs');
let path = require('path');

const items = ['item_slippers',
                'item_circlet',
                'item_recipe_wraith_band',
                'item_tango'];

const hero = 'drow_ranger';
const input = {
    abilities: 'qweqqrewqetnqrnt', talents: ['l','r','l','l']
};
const heroes1 = { 
    partitioned: 'false',
    pool: ['drow_ranger', 'bane', 'alchemist', 'abaddon', 'antimage', 'axe', 'bloodseeker','centaur', 'chen', 'chaos_knight', 'crystal_maiden']
};
const heroes2 = { 
    partitioned: 'true',
    pool1: ['drow_ranger', 'bane', 'alchemist'],
    pool2: ['abaddon', 'antimage'],
    pool3: ['axe', 'bloodseeker'],
    pool4: ['centaur', 'chen'],
    pool5: ['chaos_knight', 'crystal_maiden'],
};

let filename = `ability_item_usage_${hero}.lua`;

/**
 *  Given a character, returns a string which contains the code to select the ability 
 *  to level up according the bot script specification
 */
function generateAbilityCode(characterCode) {
    switch (characterCode) {
        case 'q': return 'Abilities[1]';
        case 'w': return 'Abilities[2]';
        case 'e': return 'Abilities[3]';
        case 'r': return 'Abilities[4]';
        case 't': return 'talent';
        case 'n': return 'nil';
    }
    return '';
}

/**
 *  Given a string such as 'qweqqr', returns an array of strings containing the appropriate 
 *  code for the abilities as specified by generateAbilityCode in that order
 */
function generateAbilityArray(str) {
    let abilities = [];
    for (let i = 0; i < str.length; i+=1) {
      abilities[i] = generateAbilityCode(str[i]);
    }
    return abilities;
}

/**
 *  Given an array of size 4 such as ['l','r','l','l'], 
 *  returns a string which contains the code to select the specified 
 *  talents up according the bot script specification
 */
function generateTalentCode(talents) {

    let level = 0;
    let code = 'local TalentTree={';
    for(let i = 0; i < talents.length; i+=1) {
        let talentIndex;
        if (talents[i] === 'l') {
            talentIndex = level + LEFT;
        }
        else {
            talentIndex = level + RIGHT;
        }
        code += '\n\tfunction()';
        code += `\n\t\treturn Talents[${talentIndex}]`;
        code += '\n\tend';
        level += 2;
    }
    code += '\nend';
    code += '\n}';
    return code;
}

/**
 *  Given a string such as 'qweqqr', returns the string which 
 *  contains the appropriate code for the abilities by using generateTalentCode
 *  to generate the code
 */
function generateLevelingAbilityCode(str) {
    let code = 'local AbilityToLevelUp=\n{';
    let arr = generateAbilityArray(str);
    for (let i = 0; i < arr.length; i+=1) {
        code += '\t' + arr[i] + ',\n';
    }
    code += '}'
    return code;
}

/**
 *  This function creates the file content (ability_item_usage) which specifies which abilities a bot should get 
 *  using the original bot script file as a template only replacing the relevant code
 *   
 *  This function expects the hero name and an object 
 *  const input = {
 *    abilities: 'qweqqrewqetnqrnt', talents: ['l','r','l','l']
 *  };
 */
function generateAbilityFileContent(hero, input) {
    const filename = `ability_item_usage_${hero}_template.lua`;
    let fileContents = fs.readFileSync(path.join(PATH_TO_TEMPLATE_SCRIPTS, ABILITY_TEMPLATE_FOLDER_NAME,filename), 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
    });
    fileContents = fileContents.replace('{{- abilities-to-level -}}', generateLevelingAbilityCode(input.abilities) + '\r\n\r\n' + generateTalentCode(input.talents) + '\r\n');
    return fileContents;
}

/**
 *  This function creates the file (ability_item_usage) which specifies which abilities
 *  a bot should get using the original bot script file as a template
 *  only replacing the relevant code
 */
function generateAbilityUsageFile(hero, input) {
    const content = generateAbilityFileContent(hero, input);
    const filename = `ability_item_usage_${hero}.lua`;
    const pathToFile = path.join(PATH_TO_CODE_DUMP, filename);
    fs.writeFile(pathToFile, content, function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

/**
 * This generates the item_purchase file content as string, 
 * specifying which items the bot must get and in what order
 *
 */
function generateItemCode(items) {
    let code = 'local ItemsToBuy = \n{';
    for(let i = 0; i < items.length; i+=1) {
        code += '\n\t\'' + items[i] + '\',';
    }
    code += '\n}';
    return code;
}

/**
 * This generates the item_purchase file using the template code 
 * to ensure that all valid code is present while the newly generated code 
 * is added.
 *
 * This function expects a hero name and the array of items (note: the items must
 * be in the form accepted by the dota bot scripting API e.g. "item_recipe_dagon") 
 */
function generateItemFileContent(hero, items) {
    const filename = `item_purchase_${hero}_template.lua`;
    let fileContents = fs.readFileSync(path.join(PATH_TO_TEMPLATE_SCRIPTS, ITEM_TEMPLATE_FOLDER_NAME, filename), 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
    });
    fileContents = fileContents.replace('{{- items-to-buy -}}', generateItemCode(items) + '\r\n');
    return fileContents;
}

function generateItemFile(hero, items) {
    const filename = `item_purchase_${hero}.lua`;
    const content = generateItemFileContent(hero, items);
    const pathToFile = path.join(PATH_TO_CODE_DUMP, filename);
    fs.writeFile(pathToFile, content, function(err) {
        if(err) {
            return console.log(err);
        }
        // console.log("The file was saved!");
    });

}

/////////////////////////////////////////////////////////////////////////
const poolNames = [
                    'hero_pool_position_1', 
                    'hero_pool_position_2',
                    'hero_pool_position_3', 
                    'hero_pool_position_4' ,
                    'hero_pool_position_5'
                ];
/**
 * This generates the content of the hero_selection.lua 
 *
 * This function expects an object like the following
 * 
 *  const heroes1 = { 
 *     partitioned: 'false',
 *     pool: ['drow_ranger', 'bane', 'alchemist', 'abaddon', 'antimage', 'axe', 'bloodseeker','centaur', 'chen', 'chaos_knight', 'crystal_maiden']
 *  };
 *  ^ for all heroes equally likely to be picked
 *
 * const heroes2 = { 
 *     partitioned: 'true',
 *     pool1: ['drow_ranger', 'bane', 'alchemist'],
 *     pool2: ['abaddon', 'antimage'],
 *     pool3: ['axe', 'bloodseeker'],
 *     pool4: ['centaur', 'chen'],
 *     pool5: ['chaos_knight', 'crystal_maiden'],
 * };
 * ^ so that one bot picks one hero from each of the pools 
 *
 * This function uses the static bot script as a template
 *
 */
function generateHeroSelectionFileContent(heroes) {
   let heroPools = generateHeroesCode(heroes);
   const filename = `hero_selection.lua`;
    let fileContents = fs.readFileSync(path.join(PATH_TO_TEMPLATE_SCRIPTS, HERO_SELECT_TEMPLATE_FOLDER_NAME, filename), 'utf8', function (err,data) {
      if (err) {
        return console.log(err);
      }
    });
    let replaceStr = '';
    for (let i = 0; i < heroPools.length; i++) {
        replaceStr += heroPools[i] + '\r\n';
    }
    fileContents = fileContents.replace('{{- pos-pool-heroes -}}', replaceStr);
    return fileContents;
}
/**
 * This function generates the code to be used by hero_selection.lua
 */
function generateHeroesCode(heroes) {
    let final = [];
    if (heroes.partitioned === 'false') {
        for (let i = 0; i < poolNames.length; i+=1) {
            final.push('')
            final[i] += (poolNames[i] + '={\r\n');
            for (let j = 0; j < heroes.pool.length; j+=1) {
                final[i] += ('\t"' + heroes.pool[j] + '",\r\n');
            }
            final[i] += '}\r\n\r\n'
        }
    }
    else {
        for (let i = 0; i < poolNames.length; i+=1) {
            final.push('')
            final[i] += (poolNames[i] + '={\r\n');
            let arr;
            switch(i) {
                case 0: 
                    arr = heroes.pool1;
                    break;
                case 1: 
                    arr = heroes.pool2;
                    break;
                case 2: 
                    arr = heroes.pool3;
                    break;
                case 3: 
                    arr = heroes.pool4;
                    break;
                case 4: 
                    arr = heroes.pool5;
                    break;
            }
            for (let j = 0; j < arr.length; j+=1) {
                final[i] += ('\t"' + arr[j] + '",\r\n');
            }
            final[i] += '}\r\n\r\n'
        }
    }
    // console.log(final)
    return final;
}

/**
 * This function generates the file to be used by hero_selection.lua
 */
function generateHeroesSelectionFile(heroes) {
    let final = generateHeroSelectionFileContent(heroes);
    const pathToFile = path.join(PATH_TO_CODE_DUMP, 'hero_selection.lua');
    fs.writeFile(pathToFile, final, function(err) {
        if(err) {
            return console.log(err);
        }
        // console.log("The file was saved!");
    });
}

function getHeroesArray(heroObject) {
    let allHeroes = [];
    if (heroObject.partitioned === 'false') {
        allHeroes = heroObject.pool;
    }
    else {
        for (let i = 0; i < poolNames.length; i+=1) {
            let arr;
            switch(i) {
                case 0: 
                    arr = heroObject.pool1;
                    break;
                case 1: 
                    arr = heroObject.pool2;
                    break;
                case 2: 
                    arr = heroObject.pool3;
                    break;
                case 3: 
                    arr = heroObject.pool4;
                    break;
                case 4: 
                    arr = heroObject.pool5;
                    break;
            }
            for (let j = 0; j < arr.length; j+=1) {
                allHeroes.push(arr[j]);
            }
        }
    }
    return allHeroes;
}

/**
 *  Copies files at path specifed to destination path
 */
function copyFile(pathToFile, destinationPath) {
    fs.createReadStream(pathToFile)
        .pipe(fs.createWriteStream(destinationPath));
}

/**
 *  Copies script (using the constants to the paths defined earlier)
 */
function copyScript(filename, destinationFilename) {
    const pathToScript = path.join(PATH_TO_SCRIPTS, filename);
    const destinationLocation = path.join(PATH_TO_CODE_DUMP, filename);
    copyFile(pathToScript, destinationLocation);
}

const essentialFilesToInclude = [
    'BotNameUtility.lua',
    'mode_attack_spirit_breaker.lua',
    'mode_laning_generic.lua',
    'mode_push_tower_mid_generic.lua',
    'mode_push_tower_top_generic.lua',
    'mode_push_tower_bot_generic.lua',
    'mode_roam_spirit_breaker.lua',
    'mode_rune_generic.lua',
    'mode_secret_shop_generic.lua',
    'mode_side_shop_generic.lua',
    'mode_side_shop_enigma.lua',
    'mode_side_shop_keeper_of_the_light.lua',
    'mode_side_shop_shadow_shaman.lua',
    'mode_side_shop_windrunner.lua',
    'mode_team_roam_generic.lua',
    'mode_ward_generic.lua',
    'MinionUtility.lua',
    'NewMinionUtil.lua',
    'PushUtility.lua',
    'RoleUtility.lua',
    'utility.lua',
    'WardUtility.lua',
]


function generateBotScripts(configObject) {
    const heroObject = configObject.heroes;
    const partitioned = heroObject.partitioned;
    generateHeroesSelectionFile(heroObject);
    let allHeroes = getHeroesArray(heroObject);
    // console.log(allHeroes);
    for (let i = 0; i < allHeroes.length; i+=1) {
        const hero = configObject[allHeroes[i]];
        const heroName = allHeroes[i];
        if (hero != undefined) {
            if (hero.abilities != undefined) {
                const abilities = hero.abilities;
                generateAbilityUsageFile(heroName, abilities);
                console.log(`Just generated ${heroName} ability script`);
            }
            // include default bot ability file
            else {
                const filename = `ability_item_usage_${heroName}.lua`;
                copyScript(filename, filename);
                console.log(`Just copied ${heroName} ability script`);
            }
            if (hero.items != undefined) {
                const items = hero.items;
                generateItemFile(heroName, items);
                console.log(`Just generated ${heroName} item script`);
            }
            // include default bot item file
            else {
                const filename = `item_purchase_${heroName}.lua`;
                copyScript(filename, filename);
                console.log(`Just copied ${heroName} item script`);
            }
        }
        // include default bot files
        else {
            let filename = `item_purchase_${heroName}.lua`;
            let pathToScript = path.join(PATH_TO_SCRIPTS, filename);
            let destinationLocation = path.join(PATH_TO_CODE_DUMP, filename);
            copyFile(pathToScript, destinationLocation);
            filename = `ability_item_usage_${heroName}.lua`;
            pathToScript = path.join(PATH_TO_SCRIPTS, filename);
            destinationLocation = path.join(PATH_TO_CODE_DUMP, filename);
            copyFile(pathToScript, destinationLocation);
        }
        // including any bot_${heroName}.lua files if they exist
        let filename = `bot_${heroName}.lua`;
        let pathToScript = path.join(__dirname, '..', 'scripts', filename);
        if (fs.existsSync(pathToScript)) {
            copyFile(pathToScript, path.join(PATH_TO_CODE_DUMP, filename));
        }
    }
    // include all essential files
    for (let i = 0; i < essentialFilesToInclude.length; i+=1) {
        let filename = essentialFilesToInclude[i];
        copyScript(filename, filename);
    }
}

const configObject = {
    heroes: heroes2,
    drow_ranger: {
        abilities: input,
        items: items
    }
}
// console.log(configObject);
generateBotScripts(configObject);