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

module.exports = router;

