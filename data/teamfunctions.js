const mongoCollections = require('../config/mongoCollections');
const teams = mongoCollections.teams;
const games = mongoCollections.games;
const matches = mongoCollections.matches;
const users = mongoCollections.users;
const userFuncs = require("../data/users.js");
let { ObjectId } = require('mongodb');

function checkString(str, name){
    if (!str) throw `${name || 'provided variable'} is empty`
    if (typeof str !== 'string') throw `${name || 'provided variable'} is not a string`
    let s = str.trim();
    if (s === '') throw `${name || 'provided variable'} is an empty string`
}


module.exports = {
    async getTeamById(id) {
        if (!id) throw 'You must provide an id to search for';
        let parsedId = ObjectId(id);
        const teamCollection = await teams();
        const team_col = await teamCollection.findOne({_id: parsedId});

        if (!team_col) throw `Error: Team not found`;
        return team_col;
    },
    async getAllTeams() {
        const teamCollection = await teams();
        const team_col = await teamCollection.find({}).toArray();
        return team_col;
    },
    async getAllTeams_Alt(transform = true){
        const teamCollection = await teams();
        const team_col = await teamCollection.find({}).toArray();

        // Transforms document to return user objects instead of their ids in array
        return transform
        ? await Promise.all(
            team_col.map(async (team) => {
              try {
                  const playerArray = [];
                for(let i = 0; i < team.players.length; i++){
                    playerArray.push(await userFuncs.getUserById(team.players[i].toString()));
                }
                team.players = playerArray;
              } catch (e) {
                console.warn("Team could not be transformed.", e);
                team.players = null;
              }
              return team;
            })
          )
        : team_col;
    },
    async addTeam(name, status, game) {
        const teamCollection = await teams();
        checkString(name, "addTeam name");
        checkString(status, "addTeam status");
        if (status.toLowerCase().trim() !== "varsity" && status.toLowerCase().trim() !== "junior varsity") {
            throw `Error: team status should be set to Varsity or Junior Varsity`;
        }
        
        checkString(game, "addTeam game");
        /*
        if (!Array.isArray(players) || players.length == 0) {
            throw 'Error: Please make sure your players is an array.';
        }
        
        for (let i = 0; i < players.length; i++) {
            // if (typeof players[i] !== 'string' || players[i].trim().length == 0) {
            //     throw 'Error: players should all be strings of length greater than zero.';
            // }
            let parsedId = ObjectId(players[i]);
        }*/
        let newTeam = {
            name: name,
            status: status,
            game: game,
            players: []
        };
        const team_insert = await teamCollection.insertOne(newTeam);
        if(team_insert.insertedCount === 0) throw `Error: Could not add team!`;

        const insertedTeam = await this.getTeamById(team_insert.insertedId.toString());
        return insertedTeam;
    },
    // async addTeam(obj){
    //     const teamCollection = await teams();
    //     if (typeof obj.name !== "string" || obj.name.trim().length === 0) {
    //         throw `Error: name should be a string of length greater than zero.`;
    //     }
    //     if (typeof obj.status !== "string" || obj.status.trim().length === 0) {
    //         throw `Error: status should be a string of length greater than zero.`;
    //     }
    //     if (obj.status.toLowerCase().trim() !== "varsity" && obj.status.toLowerCase().trim() !== "junior varsity") {
    //         throw `Error: team status should be set to Varsity or Junior Varsity`;
    //     }
    //     if (typeof obj.game !== "string" || obj.game.trim().length === 0) {
    //         throw `Error: game should be a string of length greater than zero.`;
    //     }
    //     if (!Array.isArray(obj.players) || obj.players.length == 0) {
    //         throw 'Error: Please make sure your players is an array.';
    //     }
    //     for (let i = 0; i < players.length; i++) {
    //         // if (typeof players[i] !== 'string' || players[i].trim().length == 0) {
    //         //     throw 'Error: players should all be strings of length greater than zero.';
    //         // }
    //         let parsedId = ObjectId(obj.players[i]);
    //     }
    //     let newTeam = {
    //         name: obj.name,
    //         status: obj.status,
    //         game: obj.game,
    //         players: obj.players
    //     };
    //     const newInsertInformation = await teamCollection.insertOne(newTeam);
    //     if(newInsertInformation.insertedCount === 0) throw "Error: Could not add match!";
    //     return await getTeamById(newInsertInformation.insertedId.toString());
    // }, 

    async updateTeam(id, obj){
        checkString(id,'id');
        let parsedId = ObjectId(id);
        const teamCollection = await teams();
        if (typeof obj.name !== "string" || obj.name.trim().length === 0) {
            throw `Error: name should be a string of length greater than zero.`;
        }
        if (typeof obj.status !== "string" || obj.status.trim().length === 0) {
            throw `Error: status should be a string of length greater than zero.`;
        }
        if (obj.status.toLowerCase().trim() !== "varsity" && obj.status.toLowerCase().trim() !== "junior varsity") {
            throw `Error: team status should be set to Varsity or Junior Varsity`;
        }
        if (typeof obj.game !== "string" || obj.game.trim().length === 0) {
            throw `Error: game should be a string of length greater than zero.`;
        }
        if (!Array.isArray(obj.players) || obj.players.length == 0) {
            throw 'Error: Please make sure your players is an array.';
        }
        for (let i = 0; i < players.length; i++) {
            // if (typeof players[i] !== 'string' || players[i].trim().length == 0) {
            //     throw 'Error: players should all be strings of length greater than zero.';
            // }
            let parsedId = ObjectId(obj.players[i]);
        }
        const team = await getTeamById(id);
        let updatedTeam = {
            name: obj.name,
            status: obj.status,
            game: obj.game,
            players: obj.players
        };
        const updatedInfo = await teamCollection.updateOne(
            { _id: parsedId },
            { $set: updatedTeam }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update team successfully';
        }
        return await getTeamById(id);
    },

    // Deletes team object from database
    // Also deletes user array player object and all matches associated with it
    async deleteTeam(teamId){
        checkString(teamId, "teamId");
        let parsedId = ObjectId(teamId);
        let teamToDelete = await this.getTeamById(teamId);
        const teamCollection = await teams();

        // Deletes team object
        const deletionInfo = await teamCollection.deleteOne({ _id: parsedId });
        if(deletionInfo.deletedCount === 0){
            throw `Could not delete team with id ${teamId}.`;
        }

        // Deletes all matches with team
        const matchCollection = await matches();
        await matchCollection.deleteMany({ team: teamToDelete.name });

        // Deletes all player objects associated with team in user docs
        const userCollection = await users();
        let userArray = await userCollection.find({
            activePlayers: {$elemMatch: {team: teamToDelete.name}}
        }).toArray();

        if(userArray.length !== 0){
            for(let i = 0; i < userArray.length; i++){
                let playerArray = userArray[i].activePlayers.filter(function(obj){
                    return obj.team !== teamToDelete.name;
                });
            
                let updatedUser = {
                    firstName: userArray[i].firstName,
                    lastName: userArray[i].lastName,
                    username: userArray[i].username,
                    nickname: userArray[i].nickname,
                    email: userArray[i].email,
                    discordtag: userArray[i].discordtag,
                    passwordDigest: userArray[i].passwordDigest,
                    role: userArray[i].role,
                    biography: userArray[i].biography,
                    avatar: userArray[i].avatar,
                    activePlayers: playerArray
                };
            
                const returnval = await userCollection.updateOne(
                    { _id: userArray[i]._id },
                    { $set: updatedUser }
                );
            
                if(returnval.modifiedCount === 0){
                    throw `Could not delete player with username: ${userArray[i].username}`;
                }
            }
        }

        return `${teamToDelete.name} has been successfully deleted`;
    }
};