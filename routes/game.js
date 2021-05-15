const express = require("express");
const router = express.Router();
const game = require("./../data/game.js");
const xss = require("xss");
router.post("/", async function (req, res) {
    xss(req.body.name);
    xss(req.body.description);
    if (!req.body) throw `game info required`;
    let gameInfo = req.body;
    try {
        // checkMatchObj(matchInfo);
        const newGame = await game.addGame(gameInfo);
        res.sendStatus(200);
    } catch (e) {
      res.status(400).json({ error: e });
    }
  });
router.delete('/:id', async (req, res) => {
    xss(req.body.name);
    xss(req.body.description);
    try{
        await game.deleteGame(req.params.id);
        res.sendStatus(200);
    } catch(e){
        res.sendStatus(404);
    }
});
module.exports = router;