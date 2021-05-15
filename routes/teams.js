const express = require('express');
const router = express.Router();
const data = require('../data');
const teamFuncs = data.teams;
const player = data.players;
const mongoCollections = require('../config/mongoCollections');
const teams = mongoCollections.teams;
const players = mongoCollections.players;

router.get('/', async (req, res) => {
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
        }
        res.render('pages/teamslist', {title: 'Rosters | Stevens Esports', teams: teams_list});
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
        const updatedTeam = await team.updateTeam(req.params.id, teamInfo);
        res.sendStatus(200);
    } catch(e){
        res.status(400).json({ error: e });
    }
});

module.exports = router;

