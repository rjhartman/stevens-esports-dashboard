const matches = require('./matches.js');
const games = require('./games.js');
const teams = require('./teams.js');

function getMatchTime(d){
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var ampm = 'AM';
    var hours = d.getHours();
    var min = d.getMinutes();
    if (d.getHours() > 12){
        ampm = 'PM';
        hours = hours%12;
    }
    if (d.getMinutes() < 10){
        min = '0' + min;
    }
    return `${months[d.getMonth()]} ${d.getDate()} | ${hours}:${min} ${ampm}`
}

async function getTeam(id){
    for (let team of teams){
        if (team._id == id){
            return team.name + " " + team.status;
        }
    }
}
async function get_resolved_id(id){
    if (!id) throw `no id provided`
    let res = [];
    for (let match of matches){
        if (match.date < new Date()){
            if (match.game == id){
                let matchObj = {
                    game: match.matchType,
                    date: getMatchTime(match.date),
                    team1: await getTeam(match.team),
                    team2: match.opponent,
                    result: match.result,
                    teamScore: match.teamsScore,
                    opponentScore: match.opponentScore
                }
                res.push(matchObj);
            }
        }
    }
    return res;
}
async function get_unresolved_id(id){
    if (!id) throw `no id provided`
    let res = [];
    for (let match of matches){
        if (match.date > new Date()){
            if (match.game == id){
                let matchObj = {
                    game: match.matchType,
                    date: getMatchTime(match.date),
                    team1: await getTeam(match.team),
                    team2: match.opponent,
                    result: match.result,
                    teamScore: match.teamsScore,
                    opponentScore: match.opponentScore
                }
                res.push(matchObj);
            }
        }
    }
    return res;
}
async function get_resolved(){
    let res = [];
    for (let match of matches){
        if (match.date < new Date()){
            let matchObj = {
                game: match.matchType,
                date: getMatchTime(match.date),
                team1: await getTeam(match.team),
                team2: match.opponent,
                result: match.result,
                teamScore: match.teamsScore,
                opponentScore: match.opponentScore
            }
            res.push(matchObj);
        }
        
    }
    // console.log(res[0].opponent);
    return res;
}
async function get_unresolved(){
    let res = [];
    for (let match of matches){
        let d = match.date;
        if (d > new Date()){
            let matchObj = {
                game: match.matchType,
                date: getMatchTime(d),
                team1: await getTeam(match.team),
                team2: match.opponent,
                result: match.result,
                teamScore: match.teamsScore,
                opponentScore: match.opponentScore
            }
            res.push(matchObj);
        }
    }
    return res;
}
module.exports = { 
    get_resolved,
    get_resolved_id,
    get_unresolved,
    get_unresolved_id
};