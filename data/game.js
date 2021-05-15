const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
// const teams = require('./teamfunctions.js');
let { ObjectId } = require("mongodb");
// const cloudinary = require("cloudinary").v2;
require("dotenv").config();

function checkString(str, name) {
  if (!str) throw `${name || "provided variable"} is empty`;
  if (typeof str !== "string")
    throw `${name || "provided variable"} is not a string`;
  let s = str.trim();
  if (s === "") throw `${name || "provided variable"} is an empty string`;
}
function checkGameObj(obj) {
  checkString(obj.title, "title");
  if (!Array.isArray(obj.categories))
    throw `categories should be an array of strings`;
  for (let c of obj.categories) {
    checkString(c);
  }
  checkString(obj.img, "image");
}
async function getGameById(id) {
  checkString(id, "id");
  let parsedId = ObjectId(id);
  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: parsedId });
  if (game === null) throw "No game with that id";
  // console.log(match);
  return game;
}
async function addGame(obj) {
  checkGameObj(obj);
  const gameCollection = await games();
  let newGame = {
    title: obj.title,
    categories: obj.categories,
    img: obj.img
  };
  const newInsertInformation = await gameCollection.insertOne(newGame);
  if (newInsertInformation.insertedCount === 0)
    throw "Error: Could not add match!";
  return await getGameById(newInsertInformation.insertedId.toString());
}
async function deleteGame(id) {
  checkString(id, "id");
  let game = getGameById(id);
  let parsedId = ObjectId(id);
  const gameCollection = await games();
  const deletionInfo = await gameCollection.deleteOne({ _id: parsedId });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete game with id of ${id}`;
  }
  return `${game.title} has been successfully deleted`;
}

async function getAllGames() {
  const collection = await games();
  return await collection.find({}).toArray();
}

module.exports = {
  addGame,
  getGameById,
  deleteGame,
  getAllGames,
};
