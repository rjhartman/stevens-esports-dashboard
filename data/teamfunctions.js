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
        for (i = 0; i < teamCollection.length; i++) {
            if (teamCollection[i]._id === parsedId) {
                team = teamCollection[i];
            }
        }
        if (team === undefined) {
            throw `Error: Team not found`;
        }
        return team;
    }
};