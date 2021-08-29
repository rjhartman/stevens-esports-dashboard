const mongoCollections = require('../config/mongoCollections');
const teams = mongoCollections.teams;
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

function checkTeamObj(obj){
    checkString(obj.teamName, "team name");
    checkString(obj.varsity, 'varsity status');
    checkString(obj.teamGame, "team game");
    if (obj.varsity.toLowerCase().trim() !== "varsity" && obj.varsity.toLowerCase().trim() !== "junior varsity") {
        throw `Error: team status should be set to Varsity or Junior Varsity`;
    }
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

        let newTeam = {
            name: name,
            status: status,
            game: game,
            players: []
        };
        const team_insert = await teamCollection.insertOne(newTeam);
        if(team_insert.insertedCount === 0) throw `Error: Could not add team!`;

        
        return await this.getTeamById(team_insert.insertedId.toString());
    },

    async updateTeam(id, obj){
        checkString(id,'id');
        checkTeamObj(obj);
        let parsedId = ObjectId(id);
        const teamCollection = await teams();
        const matchCollection = await matches();
        const userCollection = await users();

        // Updates team object
        const teamToUpdate = await this.getTeamById(id);
        let updatedTeam = {
            name: obj.teamName,
            status: obj.varsity,
            game: obj.teamGame,
            players: teamToUpdate.players
        };
        const updatedInfo = await teamCollection.updateOne(
            { _id: parsedId },
            { $set: updatedTeam }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw `could not update team ${teamToUpdate.name} successfully`;
        }

        // Updates all matches with updated team name
        await matchCollection.updateMany(
            { team: teamToUpdate.name },
            { $set: { team: obj.teamName }}
        );

        // Updates all user object arrays with updated team name
        await userCollection.updateMany(
            { activePlayers: { $elemMatch: { team: teamToUpdate.name }}},
            { $set: { "activePlayers.$.team": obj.teamName }}
        );

        return await this.getTeamById(id);
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