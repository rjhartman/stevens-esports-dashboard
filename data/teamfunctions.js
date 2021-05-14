// const teamData = require('./teams');
const mongoCollections = require('../config/mongoCollections');
const teams = mongoCollections.teams;
let { ObjectId } = require('mongodb');

module.exports = {
    async getTeamById(id) {
        if (!id) throw 'You must provide an id to search for';
        let parsedId = ObjectId(id);
        let team = undefined;
        const teamCollection = await teams();
        const team_col = await teamCollection.find({}).toArray();
        for (i = 0; i < team_col.length; i++) {
            if (team_col[i]._id === parsedId) {
                team = team_col[i];
            }
        }
        if (team === undefined) {
            throw `Error: Team not found`;
        }
        return team;
    },
    async getAllTeams() {
        teams_list = []
        const teamCollection = await teams();
        const team_col = await teamCollection.find({}).toArray();
        console.log(team_col);
        for (i = 0; i < team_col.length; i++) {
            teams_list.push(team_col[i])
        }
        return teams_list;
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
        if (status.toLowerCase().trim() !== "varsity" || status.toLowerCase().trim() !== "junior varsity") {
            throw `Error: team status should be set to Varsity or Junior Varsity`;
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
            let parsedId = ObjectId(players[i]);
        }
        let newTeam = {
            name: name,
            status: status,
            game: game,
            players: players
        };
        const team_insert = teamCollection.insertOne(newTeam);
        return team_insert;
    }
};