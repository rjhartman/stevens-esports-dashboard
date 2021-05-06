const teamData = require('./teams');
const playerData = require('./players');
const userData = require('./users');
/*
module.exports = {
    async getTeamById(id) {
        if (typeof id !== "number") {
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
    },

};
*/

async function getPlayerById(id){
    let playerData = {};
    if(typeof id !== 'number')
        throw `Error: id ${id} is not a number.`;
    if(Number(id) < 0)
        throw `Error: id ${id} must be a positive integer.`

    return playerData;
}

async function getUserById(id){
    let userData = {};
    if(typeof id !== 'number')
        throw `Error: id ${id} is not a number.`;
    if(Number(id) < 0)
        throw `Error: id ${id} must be a positive integer.`

    return userData;
}

async function getPersonById(id){
    let player = getPlayerById(id);
    let user = getUserById(id);

    let person = {};
    
}

module.exports = getPersonById;