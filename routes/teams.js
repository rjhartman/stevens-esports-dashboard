const express = require('express');
const router = express.Router();
const data = require('../data');
const teamFuncs = data.teams;
const player = data.players;
const mongoCollections = require('../config/mongoCollections');
const teams = mongoCollections.teams;
const players = mongoCollections.players;
const cloudinary = require("cloudinary").v2;

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
    try {
        let players_array = [];
        let temp_array = [];
        const teams_list = await teamFuncs.getAllTeams();
        const playerCollection = await players();

        const foundPlayers = await playerCollection.find({}).toArray();

        for(let i = 0; i < teams_list.length; i++){
            temp_array.push(teams_list[i].name);

            for(let j = 0; j < teams_list[i].players.length; j++){
                let filtered = foundPlayers.filter(r => r._id.toString() === teams_list[i].players[j])
                console.log(filtered)
                temp_array.push(filtered);
            }
            players_array.push(temp_array);
            temp_array = [];
            teams_list[i]["logo"] = getLogo(teams_list[i].game);
        }
        console.log(players_array);
        console.log(teams_list);

        res.render('pages/teamslist', {title: 'Rosters | Stevens Esports', teams: teams_list, players: players_array});
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
    try {
      // console.log(req.params.id);
        const team1 = await team.getTeamById(req.params.id);
    } catch(e) {
        res.sendStatus(404);
    }
    let teamInfo = req.body;
    try {
        const updatedTeam = await teams.updateTeam(req.params.id, teamInfo);
        res.sendStatus(200);
    } catch(e){
        res.status(400).json({ error: e });
    }
});

module.exports = router;

