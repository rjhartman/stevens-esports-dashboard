const playerData = require('./players');
const userData = require('./users');

async function getPlayerById(id){
    let player = undefined;

    if(typeof id !== 'string' || id.trim() == '')
        throw `Error: id ${id} is not a valid string.`;

    for(i = 0; i < playerData.length; i++){
        if(playerData[i]._id == id){
            player = playerData[i];
        }
    }

    if(player == undefined){
        throw `Error: Player not found.`
    }
    
    return player;
}

async function getUserById(id){
    let user = undefined;
    if(typeof id !== 'string' || id.trim() == '')
        throw `Error: id ${id} is not a valid string.`;

    for(i = 0; i < userData.length; i++){
        if(userData[i]._id == id){
            user = userData[i];
        }
    }

    if(user == undefined){
        throw `Error: User not found.`;
    }
    return user;
}

async function getPersonById(id){
    let player = await getPlayerById(id);
    let userId = String(player.user);

    if(typeof userId !== 'string' || userId.trim() == '')
        throw `Error: id ${userId} is not a valid string.`;
    
    let user = await getUserById(userId);


    let person = {...player, ...user};
    return person;
}

module.exports = {getPersonById};