const express = require("express");
const router = express.Router();
const match = require("./../data/match.js");
const xss = require("xss");
const games = require("./../data/game.js");
// const { game } = require("../data/index.js");
function checkString(str, name){
  if (!str) throw `${name || 'provided variable'} is empty`
  if (typeof str !== 'string') throw `${name || 'provided variable'} is not a string`
  let s = str.trim();
  if (s === '') throw `${name || 'provided variable'} is an empty string`
}

function checkMatchObj(obj){
  checkString(obj.opponent,'opponent');
  //Need some function to check the game and team objectIDs are valid when they're set up

  checkString(obj.team,'team');
  if (typeof(obj.opponentScore) != 'number') throw `score should be a number`
  if (obj.opponentScore < 0) throw `score can't be negative`
  if (typeof(obj.teamsScore) != 'number') throw `team score should be a number`
  if (obj.teamsScore < 0) throw `score can't be negative`
  checkString(obj.matchType,'match type')
}

router.post("/", async function (req, res) {
  if (!req.body) throw `match info required`;
  let matchInfo = req.body;
  xss(req.body.opponent);
  xss(req.body.game);
  xss(req.body.team);
  xss(req.body.date);
  xss(req.body.result);
  xss(req.body.opponentScore);
  xss(req.body.teamScore);
  xss(req.body.matchType);
  try {
      checkMatchObj(matchInfo);
      //check if gameid exist
      await games.getGameById(String(matchInfo.game));
      const newMatch = await match.addMatch(matchInfo);
      res.sendStatus(200);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.put('/:id', async (req, res) => {
    xss(req.body.opponent);
    xss(req.body.game);
    xss(req.body.team);
    xss(req.body.date);
    xss(req.body.result);
    xss(req.body.opponentScore);
    xss(req.body.teamScore);
    xss(req.body.matchType);
  try {
    // console.log(req.params.id);
      const match1 = await match.getMatchById(req.params.id);
  } catch(e){
      res.sendStatus(404);
  }
  let matchInfo = req.body;
  try {
      checkMatchObj(matchInfo);
      await games.getGameById(String(matchInfo.game));
      const updatedMatch = await match.updateMatch(req.params.id,matchInfo);
      res.sendStatus(200);
  } catch(e){
      res.status(400).json({ error: e });
  }
});

router.get("/", async function (req, res) {
    try {
        let unresolved = await match.get_unresolved();
        let resolved = await match.get_resolved();
        let gameList = await games.getAllGames();
        // console.log(test[0]);
        if(!req.session.user)
          return res.render("pages/matchSchedule", {
            title: "Match Schedule | Stevens Esports", 
            umatch: unresolved,
            rmatch : resolved,
            user: req.session.user,
            game: gameList,
          });
        else {
          return res.render("pages/matchSchedule", {
            title: "Match Schedule | Stevens Esports", 
            umatch: unresolved,
            rmatch : resolved,
            user: req.session.user,
            isAdmin: req.session.user.role === "administrator",
            game: gameList,
          });
        }
    } catch (e) {
      res.sendStatus(500);
    }
});
router.get("/:gameid", async function (req, res) {
    if (!req.params.gameid) throw `gameid required`;
    let gameid = req.params.gameid;
    try {
        let unresolved = await match.get_unresolved_id(gameid);
        let resolved = await match.get_resolved_id(gameid);
        // console.log(test[0]);
        let gameList = await games.getAllGames();
        if(!req.session.user)
          return res.render("pages/matchSchedule", {
            title: "Match Schedule | Stevens Esports", 
            umatch: unresolved,
            rmatch : resolved,
            game: gameList,
            user: req.session.user,
          });
        else {
          return res.render("pages/matchSchedule", {
              title: "Match Schedule | Stevens Esports", 
              umatch: unresolved,
              rmatch : resolved,
              game: gameList,
              user: req.session.user,
              isAdmin: req.session.user.role === "administrator"
          });
        }
    } catch (e) {
      res.sendStatus(500);
    }
});
router.delete("/:matchId", async function (req, res){
  if (!req.params.matchId) throw `matchId required`;
  let matchId = req.params.matchId;
});
module.exports = router;