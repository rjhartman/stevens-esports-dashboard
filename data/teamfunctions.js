const mongoCollections = require('../config/mongoCollections');
const teams = mongoCollections.teams;
let { ObjectID } = require('mongodb');

module.exports = {
    async getTeamById(id) {
        if (!id) throw 'You must provide an id to search for';
        let parsedId = ObjectID(id);
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
    // // hardcode version
    // async getTeamById(id) {
    //     if (!id) throw 'You must provide an id to search for';
    //     let team = undefined;
    //     let trueId = Number(id)
    //     for (i = 0; i < teamData.length; i++) {
    //         if (teamData[i]._id === trueId) {
    //             team = teamData[i];
    //         }
    //     }
    //     if (team === undefined) {
    //         throw `Error: Team not found`;
    //     }
    //     return team;
    // },
    async addTeam(name, status, game, players) {
        const teamCollection = await teams();
        if (typeof name !== "string" || name.trim().length === 0) {
            throw `Error: name should be a string of length greater than zero.`;
        }
        if (typeof status !== "string" || status.trim().length === 0) {
            throw `Error: status should be a string of length greater than zero.`;
        }
        if (typeof game !== "string" || game.trim().length === 0) {
            throw `Error: game should be a string of length greater than zero.`;
        }
        if (!Array.isArray(players)) {
            throw 'Error: Please make sure your players is an array.';
        }
        for (let i = 0; i < players.length; i++) {
            // if (typeof players[i] !== 'string' || players[i].trim().length == 0) {
            //     throw 'Error: players should all be strings of length greater than zero.';
            // }
            let parsedId = ObjectID(players[i]);
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
    }
};