const express = require('express');
const router = express.Router();
const data = require('../data');
const teamFuncs = data.teams;
const player = data.players;
const cloudinary = require("cloudinary").v2;
const xss = require('xss');

function initCloud() {
    cloudinary.config({
        cloud_name: "stevens-esports",
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

function getLogo(gameType) {
    initCloud();
    switch (gameType) {
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

router.get('/', async (req, res) => {
    //xss(request.body.name), xss(request.body.description)
    xss(req.body.name);
    xss(req.body.description);
    try {
        const teams_list = await teamFuncs.getAllTeams();
        const playernames = await player.getAllPlayers();
        for (i = 0; i < teams_list.length; i++) { // for each team
            for (j = 0; j < teams_list[i].players.length; j++) { // for each player in each team
                for (h = 0; h < playernames.length; h++) { // for the list of players
                    if (teams_list[i].players[j] == playernames[h]._id.toString()) { // compare ids
                        if (playernames[h]._id === "undefined") {
                            continue;
                        }
                        // if they are the same, overwrite the stored id with an object of the id and the name
                        teams_list[i].players[j] = { id: teams_list[i].players[j], name: playernames[h].user};
                    }
                }
            }
            teams_list[i]["logo"] = getLogo(teams_list[i].game);
        }

        res.render('pages/teamslist', {title: 'Rosters | Stevens Esports', teams: teams_list, user: req.session.user});
    } catch (e) {
        res.status(500);
    }
});

// router.get('/:id', async (req, res) => {
//     try {
//         players_array = []
//         let parsedId = ObjectId(req.params.id);
//         let id = req.params.id;
//         // console.log(id)
//         // const teamCollection = await teams();
//         const playerCollection = await players();
//         const team = await teamFuncs.getTeamById(id);
//         // this is so we can eventually pass in both players and teams from the database
//         for (i = 0; i < playerCollection.length; i++) {
//             let player_i = await player.getPlayerById(playerCollection[i]._id);
//             for (j = 0; j < team.players.length; j++) {
//                 if (player_i._id == team.players[j]._id) {
//                     players_array.push[player_i.user]
//                 }
//             }
//         }
//         // for (i = 0; i < playerCollection.length; i++) {
//         //     for (j = 0; j < team.players.length; j++) {
//         //         if (playerCollection[i]._id == team.players[j]._id) {
//         //             players.push(playerCollection[i].name)
//         //         }
//         //     }
//         // }
//         // res.render('teams/teampage', {title: team.name, team: team});
//         res.render('teams/teampage', {title: team.name, team: team, players: players_array });
//     } catch (e) {
//         res.status(500);
//         console.log(e);
//     }
// });

router.put('/:id', async (req, res) => {
    xss(req.body.name);
    xss(req.body.description);
    try {
      // console.log(req.params.id);
        const team1 = await team.getTeamById(req.params.id);
    } catch(e) {
        res.sendStatus(404);
    }
    let teamInfo = req.body;
    if (typeof teamInfo.name !== "string" || teamInfo.name.trim().length === 0) {
        throw `Error: name should be a string of length greater than zero.`;
    }
    if (typeof teamInfo.status !== "string" || teamInfo.status.trim().length === 0) {
        throw `Error: status should be a string of length greater than zero.`;
    }
    if (teamInfo.status.toLowerCase().trim() !== "varsity" && teamInfo.status.toLowerCase().trim() !== "junior varsity") {
        throw `Error: team status should be set to Varsity or Junior Varsity`;
    }
    if (typeof teamInfo.game !== "string" || teamInfo.game.trim().length === 0) {
        throw `Error: game should be a string of length greater than zero.`;
    }
    if (!Array.isArray(teamInfo.players) || teamInfo.players.length == 0) {
        throw 'Error: Please make sure your players is an array.';
    }
    for (let i = 0; i < players.length; i++) {
        // if (typeof players[i] !== 'string' || players[i].trim().length == 0) {
        //     throw 'Error: players should all be strings of length greater than zero.';
        // }
        let parsedId = ObjectId(teamInfo.players[i]);
    }
    try {
        const updatedTeam = await team.updateTeam(req.params.id, teamInfo);
        res.sendStatus(200);
    } catch(e){
        res.status(400).json({ error: e });
    }
});

router.post("/", async ( req, res) => {
    xss(req.body.name);
    xss(req.body.description);
    if (!req.body) throw `team info required`;
    let teamInfo = req.body;
    if (typeof teamInfo.name !== "string" || teamInfo.name.trim().length === 0) {
        throw `Error: name should be a string of length greater than zero.`;
    }
    if (typeof teamInfo.status !== "string" || teamInfo.status.trim().length === 0) {
        throw `Error: status should be a string of length greater than zero.`;
    }
    if (teamInfo.status.toLowerCase().trim() !== "varsity" && teamInfo.status.toLowerCase().trim() !== "junior varsity") {
        throw `Error: team status should be set to Varsity or Junior Varsity`;
    }
    if (typeof teamInfo.game !== "string" || teamInfo.game.trim().length === 0) {
        throw `Error: game should be a string of length greater than zero.`;
    }
    if (!Array.isArray(teamInfo.players) || teamInfo.players.length == 0) {
        throw 'Error: Please make sure your players is an array.';
    }
    for (let i = 0; i < players.length; i++) {
        // if (typeof players[i] !== 'string' || players[i].trim().length == 0) {
        //     throw 'Error: players should all be strings of length greater than zero.';
        // }
        let parsedId = ObjectId(teamInfo.players[i]);
    }
    try {
        const newTeam = await teamFuncs.addTeam(teamInfo);
        res.sendStatus(200);
    } catch (e) {
      res.status(400).json({ error: e });
    }
});
module.exports = router;