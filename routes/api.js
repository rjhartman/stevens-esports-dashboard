const express = require("express");
const router = express.Router();
const users = require("../data/users.js");
const matches = require("../data/match.js");
const gameData = require("../data/game.js");
const teamData = require("../data/teamfunctions.js");
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
  if (!Number.isInteger(score))
    throw `${name} must be an integer. Got ${score}`;
  if (score < 0) throw `${name} must be a non-negative integer.`;
}

function checkArray(arr, name) {
  if(!Array.isArray(arr))
    throw `${name} must be an array.`;
}

function checkMatchBody(body) {
  let { team, opponent, game, date, result, teamsScore, opponentScore } = body;
  checkString(team, "Team");
  checkString(opponent, "Opponent");
  checkBsonID(game, "Game");
  checkDate(date, "Date");

  // If the match hasn't happened yet, then we can have undefined results.
  if (new Date(date) > new Date()) {
    if (result) checkString(result, "Result");
    if (teamsScore && teamsScore !== 0) checkScore(teamsScore, "Team's score");
    if (opponentScore && teamsScore !== 0)
      checkScore(opponentScore, "Opponent's score");
  } else {
    checkString(result, "Result");
    checkScore(teamsScore, "Team's score");
    checkScore(opponentScore, "Opponent's score");
  }
}

function checkGameBody(body) {
  let { gameName, image } = body;
  checkString(gameName, "game title");
  checkString(image, "image link");
}

function checkTeamBody(body) {
  let { teamName, varsity, teamGame } = body;
  checkString(teamName, "team name");
  checkString(varsity, "varsity status");
  checkString(teamGame, "team game");
}

router.get("/users", async (req, res) => {
  res.json(await users.getAllUsers(true));
});

router.get("/matches", async (req, res) => {
  res.json(await matches.getAllMatches(true));
});

router.get("/teams", async (req, res) => {
  res.json(await teamData.getAllTeams_Alt(true));
});

router.get("/games", async (req, res) => {
  res.json(await gameData.getAllGames());
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

router.post("/match", async (req, res) => {
  let { team, opponent, game, date, result, teamsScore, opponentScore } =
    req.body;

  try {
    checkMatchBody(req.body);
    const gameObj = await gameData.getGameById(game);
    if (
      !result ||
      (!teamsScore && teamsScore !== 0) ||
      (!opponentScore && opponentScore !== 0)
    ) {
      result = undefined;
      teamsScore = undefined;
      opponentScore = undefined;
    }
    res.json(
      await matches.addMatch({
        team,
        opponent,
        game,
        date,
        result,
        teamsScore,
        opponentScore,
        matchType: gameObj.title,
      })
    );
  } catch (e) {
    console.error(req.body);
    console.error(e);
    res.status(400).json({ error: e });
  }
});

router.patch("/matches/:id/update", async (req, res) => {
  let { id } = req.params;
  let { team, opponent, game, date, result, teamsScore, opponentScore } =
    req.body;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  // Error checking
  try {
    checkMatchBody(req.body);
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
    console.error(e);
    res.status(400).json({ error: e });
  }
});

router.patch("/teams/:id/update", async (req, res) => {
  let { id } = req.params;
  let { teamName, varsity, teamGame } =
    req.body;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  // Error checking
  try {
    checkTeamBody(req.body);
    res.json(
      await teamData.updateTeam(id, {
        teamName,
        varsity,
        teamGame
      })
    );
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e });
  }
});

router.patch("/games/:id/update", async (req, res) => {
  let { id } = req.params;
  let { gameName, image } =
    req.body;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  // Error checking
  try {
    checkGameBody(req.body);
    res.json(await gameData.updateGame(id, { gameName, image }));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e });
  }
});

router.delete("/users/:id/delete", async (req, res) => {
  let { id } = req.params;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  try{
    const deletedUser = await users.deleteUser(id);
    return res.sendStatus(200);
  } catch(e){
    res.status(400).json({ error: e });
  }
  res.json({ success: true });
});

router.delete("/matches/:id/delete", async function (req, res){
  let { id } = req.params;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  try{
    const deletedMatch = await matches.deleteMatch(id);
    return res.sendStatus(200);
  } catch(e){
    res.status(400).json({ error: e });
  }
  res.json({ success: true });
});

router.delete("/teams/:id/delete", async function (req, res){
  let { id } = req.params;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  try{
    const deletedTeam = await teamData.deleteTeam(id);
    return res.sendStatus(200);
  } catch(e){
    res.status(400).json({ error: e });
  }
  res.json({ success: true });
});

router.delete('/games/:id/delete', async (req, res) => {
  let { id } = req.params;

  if (!id || !(id = id.trim()))
    return res.status(400).json({ error: "ID cannot be empty." });
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).json({ error: "ID was not a valid BSON id." });

  try{
      const deletedGame = await gameData.deleteGame(id);
      return res.sendStatus(200);
  } catch(e){
      return res.sendStatus(400).json({ error: e });
  }
});

module.exports = router;
