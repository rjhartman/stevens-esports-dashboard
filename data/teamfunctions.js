const mongoCollections = require('../config/mongoCollections');
const teams = mongoCollections.teams;
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
    async addTeam(name, status, game, players) {
        const teamCollection = await teams();
        if (typeof name !== "string" || name.trim().length === 0) {
            throw `Error: name should be a string of length greater than zero.`;
        }
        if (typeof status !== "string" || status.trim().length === 0) {
            throw `Error: status should be a string of length greater than zero.`;
        }
        if (status.toLowerCase().trim() !== "varsity" && status.toLowerCase().trim() !== "junior varsity") {
            throw `Error: team status should be set to Varsity or Junior Varsity`;
        }
        if (typeof game !== "string" || game.trim().length === 0) {
            throw `Error: game should be a string of length greater than zero.`;
        }
        if (!Array.isArray(players) || players.length == 0) {
            throw 'Error: Please make sure your players is an array.';
        }
        for (let i = 0; i < players.length; i++) {
            // if (typeof players[i] !== 'string' || players[i].trim().length == 0) {
            //     throw 'Error: players should all be strings of length greater than zero.';
            // }
            let parsedId = ObjectId(players[i]);
        }
        let newTeam = {
            name: name,
            status: status,
            game: game,
            players: players
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

    async deleteTeam(teamId){
        // TODO: Complete this function for deleting a team from database
        checkString(teamId, "teamId");
        let parsedId = ObjectId(teamId);
        
        const teamCollection = await teams();
        const deletionInfo = await teamCollection.deleteOne({ _id: parsedId});
        if(deletionInfo.deletedCount === 0){
            throw `Could not delete match with id $teamId}.`;
        }

        // return `${team.title} has been successfully deleted`;
    }
};