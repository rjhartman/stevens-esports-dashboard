const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const players = mongoCollections.players;
const userFunctions = require('../data/users');

let { ObjectId } = require('mongodb');

function stringChecker(string, argument){
    if(string == undefined) throw `Error: input ${argument} is undefined.`;
    if(typeof(string) != 'string') throw `Error: input ${argument} is not a string`;
    if(string.trim() == '') throw `Error: input ${argument} is only white space`;
}

async function getPlayerById(id){
    stringChecker(id, 'getPlayerById id');
    id = id.trim();

    let parsedId = ObjectId(id);

    const playerCollection = await players();
    const player = await playerCollection.findOne({ _id: parsedId});

    if(!player) throw `Error: player ${id} not found.`;

    player._id = (player._id).toString();

    return player;
};

async function getPlayerByUsername(username) {
    stringChecker(username, 'getPlayerById username');
    username = username.trim();
    const playerCollection = await players();
    const player = await playerCollection.findOne({user: username});
    if(!player) throw `Error: player ${username} not found.`;

    player._id = (player._id).toString();

    return player;
}

async function getAllPlayersByUsername(username){
    stringChecker(username, 'getAllPlayersByUsername username');
    username = username.trim();
    const playerCollection = await players();
    playerArray = [];
    
    for(x of await playerCollection.find({user: username})){
        playerArray.push(x._id);
    }

    return playerArray;
}

async function getPersonByUsername(username){

    stringChecker(username, 'username');

    let user = await userFunctions.getUser(username);

    //console.log(user);

    if(user == undefined){
        throw `Error: Player not found.`
    }

    let thePlayer = await getPlayerByUsername(user.username);


    let person = {...user, ...thePlayer};
    return person;
}

async function getAllPlayers(transform = true) {
    const collection = await players();
    let playerList = await collection.find({}).toArray();
    transform
        ? await Promise.all(
            playerList.map(async (player) => {
                try {
                    const player_cringe = await this.getPlayerById(player._id.toString());
                } catch (e) {
                    console.warn("Player could not be transformed.", e);
                    player_cringe = null;
                }
            })
        )
    : playerList;
    return playerList;
}

async function deletePlayer(playerId){
    //TODO: Delete player object from database by user
    //TODO: (will also be used in deleting user accounts should any exist as a player)

    // What this does is it deletes a specific player object based on playerId.
    stringChecker(playerId, 'playerId');

    let player = await getPlayerById(playerId);
    let parsedId = ObjectId(playerId);
    let playerCollection = await players();

    const deletionInfo = playerCollection.deleteOne({_id, parsedId});

    if(deletionInfo.deletedCount === 0){
        throw `Could not delete player object with id ${playerId}`;
    }


    return `Player object with id: ${playerId} successfully deleted.`;
}

module.exports = {getPersonByUsername, getPlayerByUsername, getPlayerById, getAllPlayers, getAllPlayersByUsername, deletePlayer}