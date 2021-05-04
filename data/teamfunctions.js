const teamData = require('./teams');
module.exports = {
    async getTeamById(id) {
        let regex = /^[0-9]+$/;
        if (id.match(regex) == null) {
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