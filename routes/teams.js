const express = require('express');
const router = express.Router();
const data = require('../data');
const teamData = data.teams;


router.get('/', async (req, res) => {
    try {
        res.render('teams/teampage', {title: 'List of Teams', data: teamData});
    } catch (e) {
        res.status(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
      const show = await showData.getShowById(req.params.id);
      //https://stackoverflow.com/questions/3790681/regular-expression-to-remove-html-tags
      show.data.summary = show.data.summary.replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim();
      res.render('shows/showpage', {title: show.data.name, body: show });
    } catch (e) {
        res.status(500).render('shows/errorpage', {title: 'Error', error: e });
    }
});


module.exports = router;