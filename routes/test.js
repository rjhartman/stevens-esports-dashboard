const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    return res.render('pages/landing', {title: 'Stevens Esports'});
});

module.exports = router;