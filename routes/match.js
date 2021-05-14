const express = require("express");
const router = express.Router();
const match = require("./../data/match.js");

function checkString(str, name){
  if (!str) throw `${name || 'provided variable'} is empty`
  if (typeof str !== 'string') throw `${name || 'provided variable'} is not a string`
  let s = str.trim();
  if (s === '') throw `${name || 'provided variable'} is an empty string`
}

function checkMatchObj(obj){
  checkString(obj.opponent,'opponent');
  //Need some function to check the game and team objectIDs are valid when they're set up
  if (typeof(obj.opponentScore) != 'number') throw `score should be a number`
  if (obj.opponentScore < 0) throw `score can't be negative`
  if (typeof(obj.teamsScore) != 'number') throw `team score should be a number`
  if (obj.teamsScore < 0) throw `score can't be negative`
  checkString(obj.matchType,'match type')
}

router.post("/", async function (req, res) {
  if (!req.body) throw `gameid required`;
  let matchInfo = req.body;
  try {
      // checkMatchObj(matchInfo);
      const newMatch = await match.addMatch(matchInfo);
      res.sendStatus(200);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.get("/", async function (req, res) {
    try {
        let unresolved = await match.get_unresolved();
        let resolved = await match.get_resolved();
        // console.log(test[0]);
        res.render("pages/matchSchedule", {
            title: "Match Schedule | Stevens Esports", 
            umatch: unresolved,
            rmatch : resolved
            });
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
        res.render("pages/matchSchedule", {
            title: "Match Schedule | Stevens Esports", 
            umatch: unresolved,
            rmatch : resolved
            });
    } catch (e) {
      res.sendStatus(500);
    }
});
module.exports = router;