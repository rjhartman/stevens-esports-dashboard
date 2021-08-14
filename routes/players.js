const express = require('express');
const router = express.Router();
const xss = require('xss');
const data = require('../data');
const userFunctions = data.users;

router.get('/', async (req, res) => {
    try {
        res.redirect('/');
    } catch (e) {
        res.status(500);
    }
});

router.get('/:username', async (req, res) => {
    if(req.params.username == undefined || typeof req.params.username != 'string'){
        res.redirect('/');
        return;
    }

    try {
        const person = await userFunctions.getUser(req.params.username);
        if(!req.session.user)
            return res.render('pages/profile', {
                title: person.nickname + " | Stevens Esports",
                player: person,
                user: req.session.user,
            });
        else {
            return res.render('pages/profile', {
                title: person.nickname + " | Stevens Esports",
                player: person,
                user: req.session.user,
                isAdmin: req.session.user.role === "administrator"
            });
        }
    } catch (e) {
        res.redirect('/');
        console.log(e);
        return;
    }
});


module.exports = router;