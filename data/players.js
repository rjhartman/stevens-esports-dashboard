const mongoCollections = require('../config/mongoCollections');
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

async function addPlayer(user, position, isStarter, isCaptain){
    stringChecker(user, "addPlayer username");
    stringChecker(position, "addPlayer position");

    const playerCollection = await players();

    if(typeof(isStarter) != 'boolean') throw `Error: input ${isStarter} for isStarter is not a boolean.`;
    if(typeof(isCaptain) != 'boolean') throw `Error: input ${isCaptain} for isCaptain is not a boolean.`;

    user = user.trim();
    user = user.toLowerCase();
    position = position.trim();
    position = position.toLowerCase();

    if(!userFunctions.getUser(user)) throw `Error: user not found/valid.`

    const returnval = await playerCollection.insertOne({
        user: user,
        position: position,
        isStarter: isStarter,
        isCaptain: isCaptain
    });

    if(returnval.insertedCount === 0) throw "Error: Could not add player!";
    let player = await this.getPlayerById(returnval.insertedId.toString());
    return player;
}

async function getPersonByUsername(username){
    let user = await userFunctions.getUser(username);

    // Error checking

    console.log(user);

    if(user == undefined){
        throw `Error: Player not found.`
    }

    let thePlayer = await getPlayerByUsername(user.username);

    let person = {...user, ...thePlayer};
    return person;
}


module.exports = {addPlayer, getPersonByUsername, getPlayerByUsername, getPlayerById}