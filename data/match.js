const mongoCollections = require("../config/mongoCollections");
const matches = mongoCollections.matches;
const games = require("./games.js");
const teams = require("./teamfunctions.js");
let { ObjectId } = require("mongodb");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

function checkString(str, name) {
  if (!str) throw `${name || "provided variable"} is empty`;
  if (typeof str !== "string")
    throw `${name || "provided variable"} is not a string`;
  let s = str.trim();
  if (s === "") throw `${name || "provided variable"} is an empty string`;
}

function checkMatchObj(obj) {
  checkString(obj.opponent, "opponent");
  //Need some function to check the game and team objectIDs are valid when they're set up
  if (typeof obj.opponentScore != "number") throw `score should be a number`;
  if (obj.opponentScore < 0) throw `score can't be negative`;
  if (typeof obj.teamsScore != "number") throw `team score should be a number`;
  if (obj.teamsScore < 0) throw `score can't be negative`;
  checkString(obj.matchType, "match type");
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
  checkMatchObj(obj);
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
  checkMatchObj(obj);
  const match = await getMatchById(id);
  const matchCollection = await matches();
  let updatedMatch = {
    opponent: obj.opponent,
    game: obj.game,
    team: obj.team,
    date: obj.date,
    result: obj.result,
    opponentScore: obj.opponentScore,
    teamsScore: obj.teamsScore,
    matchType: obj.matchType,
  };
  const updatedInfo = await matchCollection.updateOne(
    { _id: parsedId },
    { $set: updatedMatch }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update match successfully";
  }
  return match;
}

async function getTeam(id) {
  for (let team of teams) {
    if (team._id == id) {
      return team.name + " " + team.status;
    }
  }
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

async function getAllMatches() {
  const collection = await matches();
  return await collection.find({}).toArray();
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
