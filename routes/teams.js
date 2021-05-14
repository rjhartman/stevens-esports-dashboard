const express = require('express');
const router = express.Router();
const data = require('../data');
// const teamData = data.teams;
const teamFuncs = data.teams;
// const playerData = data.players;
const player = data.players;
const mongoCollections = require('../config/mongoCollections');
const teams = mongoCollections.teams;
const players = mongoCollections.players;
let { ObjectId } = require('mongodb');

router.get('/', async (req, res) => {
    try {
        // const teamCollection = await teams();
        // console.log(teamCollection)
        const team_list = await teamFuncs.getAllTeams();
        console.log(team_list)
        // res.render('teams/teamslist', {title: 'List of Teams', teams: teamData});
        res.render('teams/teamslist', {title: 'List of Teams', teams: team_list});
    } catch (e) {
        res.status(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        players_array = []
        let parsedId = ObjectId(req.params.id);
        let id = req.params.id;
        // console.log(id)
        // const teamCollection = await teams();
        const playerCollection = await players();
        const team = await teamFuncs.getTeamById(id);
        // this is so we can eventually pass in both players and teams from the database
        for (i = 0; i < playerCollection.length; i++) {
            let player_i = await player.getPlayerById(playerCollection[i]._id);
            for (j = 0; j < team.players.length; j++) {
                if (player_i._id == team.players[j]._id) {
                    players_array.push[player_i.user]
                }
            }
        }
        // for (i = 0; i < playerCollection.length; i++) {
        //     for (j = 0; j < team.players.length; j++) {
        //         if (playerCollection[i]._id == team.players[j]._id) {
        //             players.push(playerCollection[i].name)
        //         }
        //     }
        // }
        // res.render('teams/teampage', {title: team.name, team: team});
        res.render('teams/teampage', {title: team.name, team: team, players: players_array });
    } catch (e) {
        //res.status(500).render('shows/errorpage', {title: 'Error', error: e });
        res.status(500);
        console.log(e);
    }
});

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

