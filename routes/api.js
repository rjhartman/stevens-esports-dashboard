const express = require("express");
const router = express.Router();
const users = require("./../data/users.js");
const matches = require("./../data/match.js");
const { ObjectID } = require("mongodb");

function checkString(str, name) {
  if (typeof str !== "string") throw `${name} must be a string.`;
  if (!str || !(str = str.trim())) throw `${name} cannot be empty.`;
}

function checkBsonID(str, name) {
  if (typeof str !== "string") throw `${name} must be a string.`;
  if (!ObjectID.isValid(str)) throw `${name} is not a valid BSON ID.`;
}

function checkDate(str, name) {
  checkString(str, name);
  const timestamp = Date.parse(str);
  if (isNaN(timestamp) === true) throw `${name} was not a valid date string.`;
}

function checkScore(num, name) {
  const score = parseInt(num);
  if (!Number.isInteger(score)) throw `${name} must be an integer.`;
  if (score < 0) throw `${name} must be a non-negative integer.`;
}

router.get("/users", async (req, res) => {
  res.json(await users.getAllUsers(true));
});

router.get("/matches", async (req, res) => {
  res.json(await matches.getAllMatches(true));
});

router.post("/users/:id/promote", async (req, res) => {
  let { id } = req.params;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  try {
    await users.setRole(id, "administrator");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  res.json({ success: true });
});

router.post("/users/:id/demote", async (req, res) => {
  let { id } = req.params;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  try {
    await users.setRole(id, "regular");
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  res.json({ success: true });
});

router.patch("/matches/:id/update", async (req, res) => {
  let { id } = req.params;
  console.log(req.body);
  let { team, opponent, game, date, result, teamsScore, opponentScore } =
    req.body;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  // Error checking
  try {
    checkString(team, "Team");
    checkString(opponent, "Opponent");
    checkBsonID(game, "Game");
    checkDate(date, "Date");
    checkString(result, "Result");
    checkScore(teamsScore, "Team's score");
    checkScore(opponentScore, "Opponent's score");
    teamsScore = parseInt(teamsScore);
    opponentScore = parseInt(opponentScore);
    res.json(
      await matches.updateMatch(id, {
        team,
        opponent,
        game,
        date,
        result,
        teamsScore,
        opponentScore,
      })
    );
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

module.exports = router;
