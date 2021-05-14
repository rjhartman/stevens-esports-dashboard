const teamData = require('./teams');
// const mongoCollections = require('../config/mongoCollections');
// const teams = mongoCollections.teams;
// let { ObjectId } = require('mongodb');

module.exports = {
    async getTeamById(id) {
        if (!id) throw 'You must provide an id to search for';
        let parsedId = ObjectId(id);
        let team = undefined;
        const teamCollection = await teams();
        for (i = 0; i < teamCollection.length; i++) {
            if (teamCollection[i]._id === parsedId) {
                team = teamCollection[i];
            }
        }
        if (team === undefined) {
            throw `Error: Team not found`;
        }
        return team;
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
            if (typeof players[i] !== 'string' || players[i].trim().length == 0) {
                throw 'Error: players should all be strings of length greater than zero.';
            }
        }
        let newTeam = {
            _id: uuid(),
            name: name,
            status: status,
            game: game,
            players: players
        };
        teamCollection.insertOne(newTeam);
    }
};