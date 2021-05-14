const express = require("express");
const router = express.Router();
const match = require("./../data/match.js");

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