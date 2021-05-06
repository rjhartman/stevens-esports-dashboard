const express = require('express');
const router = express.Router();
const data = require('../data');
const teamData = data.teams;


router.get('/', async (req, res) => {
    try {
        res.render('teams/teamslist', {title: 'List of Teams', teams: teamData});
    } catch (e) {
        res.status(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        let id = Number(req.params.id);
        const team = await teamFuncs.getTeamById(id);
        res.render('teams/teampage', {title: team.name, team: team });
    } catch (e) {
        //res.status(500).render('shows/errorpage', {title: 'Error', error: e });
        res.status(500);
        console.log(e);
    }
});


module.exports = router;