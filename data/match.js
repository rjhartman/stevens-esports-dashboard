const { match } = require(".");
const mongoCollections = require("../config/mongoCollections");
const matches = mongoCollections.matches;
// const matches = require('./matches.js');
const games = require('./games.js');
const teams = require('./teams.js');
function checkString(str, name){
    if (!str) throw `${name || 'provided variable'} is empty`
    if (typeof str !== 'string') throw `${name || 'provided variable'} is not a string`
    let s = str.trim();
    if (s === '') throw `${name || 'provided variable'} is an empty string`
}
function checkMatchObj(obj){
    checkString(obj.opponent,'opponent');
    //Need some function to check the game and team objectIDs are valid when they're set up
    if (typeof(obj.opponentScore) != 'number') throw `score should be a number`
    if (obj.opponentScore < 0) throw `score can't be negative`
    if (typeof(obj.teamsScore) != 'number') throw `team score should be a number`
    if (obj.teamsScore < 0) throw `score can't be negative`
    checkString(obj.matchType,'match type')
}
async function addMatch(obj){
    checkMatchObj(obj);
    const matchCollection = await matches();
    let newMatch = {
        // String
        opponent: obj.opponent,
        // Object ID of the game
        game: obj.game,
        // Object ID of the team competing
        team: obj.team,
        // Date Field
        date: obj.date,
        // String, NA for unresolved matches
        result: obj.result,
        // Number
        opponentScore: obj.opponentScore,
        // Number
        teamsScore: obj.teamsScore,
        // String
        matchType: obj.matchType
    };
    const newInsertInformation = await matchCollection.insertOne(newMatch);
}
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
    const matchCollection = await matches();
    const matchList = await matchCollection.find({}).toArray();
    for (let match of matchList){
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
    const matchCollection = await matches();
    const matchList = await matchCollection.find({}).toArray();
    for (let match of matchList){
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
    const matchCollection = await matches();
    const matchList = await matchCollection.find({}).toArray();
    for (let match of matchList){
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
    const matchCollection = await matches();
    const matchList = await matchCollection.find({}).toArray();
    for (let match of matchList){
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
    get_unresolved_id,
    addMatch
};