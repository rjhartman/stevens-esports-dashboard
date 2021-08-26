const mongoCollections = require("../config/mongoCollections");
const games = mongoCollections.games;
const teams = mongoCollections.teams;
const users = mongoCollections.users;
const matches = mongoCollections.matches;
let { ObjectId } = require("mongodb");

require("dotenv").config();

function checkString(str, name) {
  if (!str) throw `${name || "provided variable"} is empty`;
  if (typeof str !== "string")
    throw `${name || "provided variable"} is not a string`;
  let s = str.trim();
  if (s === "") throw `${name || "provided variable"} is an empty string`;
}
function checkGameObj(obj) {
  checkString(obj.gameName, "title");
  checkString(obj.image, "image");
}
async function getGameById(id) {
  checkString(id, "id");
  let parsedId = ObjectId(id);
  const gameCollection = await games();
  const game = await gameCollection.findOne({ _id: parsedId });
  if (game === null) throw "No game with that id";
  return game;
}
async function getGameByName(gameName){
  checkString(gameName, "gameName");
  const gameCollection = await games();
  const game = await gameCollection.findOne({ title: gameName });
  if(game === null) throw "No game with that name";
  return game;
}
async function addGame(obj) {
  checkGameObj(obj);
  const gameCollection = await games();
  let newGame = {
    title: obj.gameName,
    logo: obj.image
  };
  const newInsertInformation = await gameCollection.insertOne(newGame);
  if (newInsertInformation.insertedCount === 0)
    throw "Error: Could not add match!";
  return await getGameById(newInsertInformation.insertedId.toString());
}
async function deleteGame(id) {
  checkString(id, "id");
  let gameToDelete = await getGameById(id);
  let parsedId = ObjectId(id);
  const gameCollection = await games();
  const teamCollection = await teams();
  const userCollection = await users();
  const matchCollection = await matches();

  // Deletes all player objects in user doc associated with team of game
  let userArray = await userCollection.find({
    activePlayers: {$elemMatch: {game: gameToDelete.title}}
  }).toArray();

  if(userArray.length !== 0){
    for(let i = 0; i < userArray.length; i++){
      let playerArray = userArray[i].activePlayers.filter(function(obj){
        return obj.game !== gameToDelete.title;
      });
  
      let updatedUser = {
        firstName: userArray[i].firstName,
        lastName: userArray[i].lastName,
        username: userArray[i].username,
        nickname: userArray[i].nickname,
        email: userArray[i].email,
        discordtag: userArray[i].discordtag,
        passwordDigest: userArray[i].passwordDigest,
        role: userArray[i].role,
        biography: userArray[i].biography,
        avatar: userArray[i].avatar,
        activePlayers: playerArray
      };
  
      const returnval = await userCollection.updateOne(
          { _id: userArray[i]._id },
          { $set: updatedUser }
      );
  
      if(returnval.modifiedCount === 0){
          throw `Could not delete player with username: ${userArray[i].username}`;
      }
    }
  }
  
  // Deletes all matches associated with game
  const deleteAllMatchInfo = await matchCollection.deleteMany({ matchType: gameToDelete.title });

  // Deletes all teams associated with the game
  const deleteAllTeamsInfo = await teamCollection.deleteMany({ game: gameToDelete.title });

  const deletionInfo = await gameCollection.deleteOne({ _id: parsedId });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete game with id of ${id}`;
  }
  return `${gameToDelete.title} has been successfully deleted`;
}

async function getAllGames() {
  const collection = await games();
  return await collection.find({}).toArray();
}

module.exports = {
  addGame,
  getGameById,
  getGameByName,
  deleteGame,
  getAllGames,
};
