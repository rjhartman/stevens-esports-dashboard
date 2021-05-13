const express = require('express');
const router = express.Router();

const data = require('../data');
const playerFuncs = data.playerfunctions;

router.get('/', async (req, res) => {
    try {
        res.status(400).render('player/playerNotExist', {title: ''});
    } catch (e) {
        res.status(500);
    }
});

router.get('/:playerid', async (req, res) => {
    if(req.params.playerid == undefined){
        res.status(400).render('player/playerNotExist', {title: 'Error 404: Player not Found!'});
        return;
    }

    if(typeof req.params.playerid != 'string'){
        console.log(typeof playerid)
        res.status(400).render('player/error', {title: '400', error: 'Code 400: Search term is not type string.'});
        return;
    }


    try {
        let id = Number(req.params.playerid);
        const person = await playerFuncs.getPersonById(id);
        res.render('teams/teampage', {title: person.nickname, player: person});
    } catch (e) {
        //res.status(500).render('shows/errorpage', {title: 'Error', error: e });
        res.status(500);
        console.log(e);
    }
});


module.exports = router;