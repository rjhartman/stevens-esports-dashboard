const express = require('express');
const router = express.Router();
const data = require('../data');
const teamData = data.teams;
const teamFuncs = data.teamfunctions;
// const playerData = data.players;

router.get('/', async (req, res) => {
    try {
        res.render('teams/teamslist', {title: 'List of Teams', teams: teamData});
    } catch (e) {
        res.status(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        // players = []
        let id = Number(req.params.id);
        const team = await teamFuncs.getTeamById(id);
        // this is so we can eventually pass in both players and teams from the database
        // for (i = 0; i < playerData.length; i++) {
        //     for (j = 0; j < team.players.length; j++) {
        //         if (playerData[i]._id == team.players[i]._id) {
        //             players.push(playerData[i])
        //         }
        //     }
        // }
        // res.render('teams/teampage', {title: team.name, team: team, players:players });
        res.render('teams/teampage', {title: team.name, team: team });
    } catch (e) {
        //res.status(500).render('shows/errorpage', {title: 'Error', error: e });
        res.status(500);
        console.log(e);
    }
});


module.exports = router;