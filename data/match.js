const matches = require('./matches.js');
const games = require('./games.js');
const teams = require('./teams.js');
const cloudinary = require("cloudinary").v2;

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

function getLogo(matchType) {
    cloudinary.config({
        cloud_name: "stevens-esports",
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    switch(matchType){
        case "League of Legends":
            return cloudinary.url("logos/league_logo_2_red.png");
        case "Counter-Strike: Global Offensive":
            return cloudinary.url("logos/csgo_logo_red.png");
        case "Overwatch":
            return cloudinary.url("logos/overwatch_logo_red.png");
        case "Rocket League":
            return cloudinary.url("logos/rocket_league_logo_red.png");
        case "Valorant":
            return cloudinary.url("logos/valorant_logo_red.png");
        case "Hearthstone":
            return cloudinary.url("logos/hearthstone_logo_red.png");
        case "Call of Duty":
            return cloudinary.url("logos/cod_logo_red.png");
        case "Rainbow Six: Siege":
            return cloudinary.url("logos/r6_logo_red.png");
    }
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
                    game: getLogo(match.matchType),
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
                    game: getLogo(match.matchType),
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
                game: getLogo(match.matchType),
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
                game: getLogo(match.matchType),
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