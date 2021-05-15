const express = require("express");
const router = express.Router();
const game = require("./../data/game.js");
const xss = require("xss");

router.post("/", async function (req, res) {
    if (!req.body) throw `game info required`;
    let gameInfo = req.body;
    xss(req.body.title);
    xss(req.body.categories);
    try {
        // checkMatchObj(matchInfo);
        const newGame = await game.addGame(gameInfo);
        res.sendStatus(200);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });
router.delete('/:id', async (req, res) => {
    try{
        await game.deleteGame(req.params.id);
        res.sendStatus(200);
    } catch(e){
        res.sendStatus(404);
    }
});
module.exports = router;