const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../data');
const playerFuncs = data.players;

router.get('/', async (req, res) => {
    xss(req.body.name);
    xss(req.body.description);
    try {
        res.redirect('/');
    } catch (e) {
        res.status(500);
    }
});

router.get('/:playerid', async (req, res) => {
    xss(req.body.name);
    xss(req.body.description);
    if(req.params.playerid == undefined || typeof req.params.playerid != 'string'){
        res.redirect('/');
        return;
    }

    try {
        let username = req.params.playerid;
        const person = await playerFuncs.getPersonByUsername(username);
        res.render('pages/profile', {title: person.nickname + " | Stevens Esports", player: person});
        return;
    } catch (e) {
        res.redirect('/');
        console.log(e);
        return;
    }
});


module.exports = router;