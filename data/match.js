const mongoCollections = require("../config/mongoCollections");
const matches = mongoCollections.matches;
const gameData = require("./game.js");
const teams = require("./teamfunctions.js");
let { ObjectId } = require("mongodb");
const cloudinary = require("cloudinary").v2;
const { game } = require(".");
require("dotenv").config();

function checkString(str, name) {
  if (!str) throw `${name || "provided variable"} is empty`;
  if (typeof str !== "string")
    throw `${name || "provided variable"} is not a string`;
  let s = str.trim();
  if (s === "") throw `${name || "provided variable"} is an empty string`;
}

async function checkMatchObj(obj, strict = true) {
  let {
    opponent,
    game,
    team,
    date,
    result,
    opponentScore,
    teamsScore,
    matchType,
  } = obj;
  console.log(obj);
  if (!(opponent === undefined && !strict)) checkString(opponent, "opponent");
  if (!(game === undefined && !strict) && !ObjectId.isValid(game))
    throw `Game was not a valid BSON ID.`;
  if (!(team === undefined && !strict)) checkString(team, "team");

  // Check the date
  if (!(date === undefined && !strict)) {
    checkString(date, "date");
    const timestamp = Date.parse(date);
    if (isNaN(timestamp)) throw `Date was not a valid date.`;
  }

  // If the date is in the future, then win and loss can be undefined.
  if (!(date === undefined && !strict) && new Date(date) > new Date()) {
    if (result !== undefined) checkString(result, "Result");
    if (opponentScore !== undefined) {
      if (typeof opponentScore !== "number")
        throw `Opponent's score must be an integer.`;
      if (opponentScore < 0) throw `Opponent's score must be non-zero.`;
    }
    if (teamsScore !== undefined) {
      if (typeof teamsScore !== "number")
        throw `Team's score must be an integer.`;
      if (teamsScore < 0) throw `Team's score must be non-zero.`;
    }
  } else if (!(date === undefined && !strict)) {
    checkString(result);
    if (typeof opponentScore !== "number")
      throw `Opponent's score must be an integer. Received ${typeof opponentScore}`;
    if (opponentScore < 0) throw `Opponent's score must be non-zero.`;
    if (typeof teamsScore !== "number")
      throw `Team's score must be an integer.`;
    if (teamsScore < 0) throw `Team's score must be non-zero.`;
  }

  if (!(matchType === undefined && !strict))
    checkString(matchType, "match type");
}

function getMatchTime(d) {
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var ampm = "AM";
  var hours = d.getHours();
  var min = d.getMinutes();
  if (d.getHours() > 12) {
    ampm = "PM";
    hours = hours % 12;
  }
  if (d.getMinutes() < 10) {
    min = "0" + min;
  }
  return `${months[d.getMonth()]} ${d.getDate()} | ${hours}:${min} ${ampm}`;
}

function getLogo(matchType) {
  cloudinary.config({
    cloud_name: "stevens-esports",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  switch (matchType) {
    case "League of Legends":
      return cloudinary.url("logos/league_logo_2_red.png");
    case "Counter-Strike: Global Offensive":
      return cloudinary.url("logos/csgo_logo_red.png");
    case "Overwatch":
      return cloudinary.url("logos/overwatch_logo_red.png");
    case "Rocket League":
      return cloudinary.url("logos/rocket_league_logo_red.png");
    case "Valorant":
      return cloudinary.url("logos/valorant_logo_red.png");
    case "Hearthstone":
      return cloudinary.url("logos/hearthstone_logo_red.png");
    case "Call of Duty":
      return cloudinary.url("logos/cod_logo_red.png");
    case "Rainbow Six: Siege":
      return cloudinary.url("logos/r6_logo_red.png");
  }
}
async function getMatchById(id) {
  // console.log(id);
  checkString(id, "id");

  let parsedId = ObjectId(id);
  const matchCollection = await matches();
  // console.log(id);
  const match = await matchCollection.findOne({ _id: parsedId });
  if (match === null) throw "No match with that id";
  // console.log(match);
  return match;
}
async function addMatch(obj) {
  obj.opponentScore = parseInt(obj.opponentScore);
  obj.teamsScore = parseInt(obj.teamsScore);
  await checkMatchObj(obj);
  const matchCollection = await matches();
  let newMatch = {
    // String
    opponent: obj.opponent,
    // Object ID of the game
    game: obj.game,
    // Object ID of the team competing
    team: obj.team,
    // Date Field
    date: obj.date,
    // String, NA for unresolved matches
    result: obj.result,
    // Number
    opponentScore: obj.opponentScore,
    // Number
    teamsScore: obj.teamsScore,
    // String
    matchType: obj.matchType,
  };
  const newInsertInformation = await matchCollection.insertOne(newMatch);
  if (newInsertInformation.insertedCount === 0)
    throw "Error: Could not add match!";
  return await getMatchById(newInsertInformation.insertedId.toString());
}
async function getMatchById(id) {
  checkString(id, "id");
  let parsedId = ObjectId(id);
  const matchCollection = await matches();
  const match = await matchCollection.findOne({ _id: parsedId });
  if (match === null) throw "No match with that id";
  return match;
}

async function updateMatch(id, obj) {
  checkString(id, "id");
  let parsedId = ObjectId(id);
  await checkMatchObj(obj, false);
  const match = await getMatchById(id);
  const matchCollection = await matches();
  const updatedMatch = {};
  for ([key, value] of Object.entries(obj)) {
    updatedMatch[key] = value;
  }

  const updatedInfo = await matchCollection.updateOne(
    { _id: parsedId },
    { $set: updatedMatch }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update match.";
  }
  return match;
}

async function get_resolved_id(id) {
  if (!id) throw `no id provided`;
  let res = [];
  const matchCollection = await matches();
  const matchList = await matchCollection.find({}).toArray();
  for (let match of matchList) {
    if (match.date < new Date()) {
      if (match.game == id) {
        let matchObj = {
          game: getLogo(match.matchType),
          date: getMatchTime(match.date),
          team1: match.team,
          team2: match.opponent,
          result: match.result,
          teamScore: match.teamsScore,
          opponentScore: match.opponentScore,
        };
        res.push(matchObj);
      }
    }
  }
  return res;
}
async function get_unresolved_id(id) {
  if (!id) throw `no id provided`;
  let res = [];
  const matchCollection = await matches();
  const matchList = await matchCollection.find({}).toArray();
  for (let match of matchList) {
    if (match.date > new Date()) {
      if (match.game == id) {
        let matchObj = {
          game: getLogo(match.matchType),
          date: getMatchTime(match.date),
          team1: match.team,
          team2: match.opponent,
          result: match.result,
          teamScore: match.teamsScore,
          opponentScore: match.opponentScore,
        };
        res.push(matchObj);
      }
    }
  }
  return res;
}
async function get_resolved() {
  let res = [];
  const matchCollection = await matches();
  const matchList = await matchCollection.find({}).toArray();
  for (let match of matchList) {
    if (match.date < new Date()) {
      let matchObj = {
        game: getLogo(match.matchType),
        date: getMatchTime(match.date),
        team1: match.team,
        team2: match.opponent,
        result: match.result,
        teamScore: match.teamsScore,
        opponentScore: match.opponentScore,
      };
      res.push(matchObj);
    }
  }
  // console.log(res[0].opponent);
  return res;
}
async function get_unresolved() {
  let res = [];
  const matchCollection = await matches();
  const matchList = await matchCollection.find({}).toArray();
  for (let match of matchList) {
    let d = match.date;
    if (d > new Date()) {
      let matchObj = {
        game: getLogo(match.matchType),
        date: getMatchTime(d),
        team1: match.team,
        team2: match.opponent,
        result: match.result,
        teamScore: match.teamsScore,
        opponentScore: match.opponentScore,
      };
      res.push(matchObj);
    }
  }
  return res;
}

/**
 *
 * Gets all matches from Mongo, with optional transformations.
 *
 * @param   {bool}  transform If true, objectIDs will be transformed into their corresponding documents.
 * @returns {Array}           The array of matches found
 */
async function getAllMatches(transform = true) {
  const collection = await matches();
  let matchesList = await collection.find({}).toArray();

  // If called with transform flag,
  // go through each match and get the document for
  // each game.
  return transform
    ? await Promise.all(
        matchesList.map(async (match) => {
          try {
            const game = await gameData.getGameById(match.game.toString());
            match.game = game;
          } catch (e) {
            console.warn("Game could not be transformed.", e);
            match.game = null;
          }
          return match;
        })
      )
    : matchesList;
}

module.exports = {
  get_resolved,
  get_resolved_id,
  get_unresolved,
  get_unresolved_id,
  getAllMatches,
  addMatch,
  updateMatch,
  getMatchById,
};
