const teamData = require('teams.js');
module.exports = {


    async getTeamById(id) {
        if (id.match(/^[0-9]+$/) == null) {
            throw `Error: id must be a number`;
        }
        if (Number(id) < 1) {
            throw `Error: id must be a positive integer`;
        }
        let team = undefined;
        for (i = 0; i < teamData.length; i++) {
            if (teamData[i]._id === id) {
                team = teamData[i];
            }
        }
        if (team === undefined) {
            throw `Error: Show not found`;
        }
        return team;
    }
};