const mongoCollections = require("../config/mongoCollections");
const fs = require('fs');
const streamifier = require('streamifier');
const cloudinary = require("cloudinary").v2;
const { ObjectID } = require("mongodb");
const { resolve } = require("path");

const users = mongoCollections.users;
const teams = mongoCollections.teams;

function initCloud() {
  cloudinary.config({
    cloud_name: "stevens-esports",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}
function checkString(str, name) {
  if (!str) throw `${name || "provided variable"} is empty`;
  if (typeof str !== "string")
    throw `${name || "provided variable"} is not a string`;
  let s = str.trim();
  if (s === "") throw `${name || "provided variable"} is an empty string`;
}

let uploadImage = (avatar) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream({
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      crop: "limit",
      folder: "avatars/"
    },
    function(e,r) {
      if(r)
        resolve(r);
      else
        reject(e);
    });
    streamifier.createReadStream(avatar).pipe(stream);
  });
};

function findImageNameFromUrl(url){
  var imageName = url.split('/').pop();
  return imageName.split('.').slice(0,-1).join('.');
}

// Upon deleting user, if user is not using default avatar,
// will delete image from cloud to save space
let deleteImage = (avatar) => {
  let imageName = findImageNameFromUrl(avatar);
  if(imageName != "default-player"){
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy("avatars/" + imageName,
        function(e, r){
          if(r)
            resolve(r);
          else
            reject(e);
        }
      );
    });
  }
}


async function checkUserObj(userObj){
    checkString(userObj.firstName, "firstName");
    checkString(userObj.lastName, "lastName");
    checkString(userObj.username, "userName");
    checkString(userObj.nickname, "nickName");
    checkString(userObj.email, "email");
    if(!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(userObj.email))){
      throw `Email not valid format.`
    }
    checkString(userObj.discordtag, "discordtag");
    if (!(/^.{3,32}#[0-9]{4}$/.test(userObj.discordtag))){
      throw `Discord tag not in correct format.`;
    }
    checkString(userObj.passwordDigest, "passwordDigest");
    checkString(userObj.role, "roleName");
    checkString(userObj.biography, "biography");
    if (!userObj.avatar) throw `no input for avatar`;
}
module.exports = {
  async getUser(username) {
    const collection = await users();
    if (typeof username !== "string")
      throw `Username/email must be a string! Received ${typeof username}`;
    if (!username || !(username = username.trim()))
      throw `Username/email cannot be empty.`;

    // The username may be an email or username. Search for both.
    username = username.toLowerCase();

    const user = await collection.findOne({
      $or: [
        {
          email: username,
        },
        {
          username: username,
        },
      ],
    });

    if (!user) throw `User with username ${username} not found.`;
    return user;
  },
  async getUserById(id) {
    const collection = await users();
    if (typeof id !== "string")
      throw `ID must be a string! Received ${typeof id}`;
    if (!id || !(id = id.trim())) throw `ID cannot be empty.`;

    let parsedId = ObjectID(id);

    const user = await collection.findOne({
      _id: parsedId,
    });

    if (!user) throw `Error: player ${id} not found.`;

    user._id = user._id.toString();

    return user;
  },
  async getRandomUser() {
    const collection = await mongoCollections.users();
    // The username may be an email or username. Search for both.
    const users = await collection
      .aggregate([
        {
          $sample: { size: 1 },
        },
      ])
      .toArray();
    return users[0];
  },
  async addUser(
    // Error handling
    firstName,
    lastName,
    username,
    email,
    discordtag,
    passwordDigest,
    nickname,
    bio,
    role = "regular"
  ) {
    const collection = await mongoCollections.users();
    checkString(firstName, "firstName");
    checkString(lastName, "lastName");
    checkString(username, "userName");
    checkString(nickname, "nickName");
    checkString(email, "email");
    if(!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email))){
      throw `Email not valid format.`
    }
    checkString(discordtag, "discordtag")
    if (!/^.{3,32}#[0-9]{4}$/.test(discordtag)){
      throw `Discord tag not in correct format.`;
    }
    checkString(passwordDigest, "passwordDigest");
    // checkString(userObj.role, "roleName");
    checkString(bio, "biography");
    username = username.toLowerCase();    

    const returnVal = await collection.insertOne({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      discordtag: discordtag,
      passwordDigest: passwordDigest,
      nickname: nickname,
      role: role,
      biography: bio,
      avatar: "https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png",
      activePlayers: []
    });

    if (returnVal.insertedCount === 0) throw "Error: Could not add user!";
    return await this.getUserById(returnVal.insertedId.toString());
  },
  async getAllUsers(sanitize = false) {
    const collection = await mongoCollections.users();
    // The username may be an email or username. Search for both.
    const users = await collection.find({}).toArray();
    return sanitize
      ? users.map((user) => {
          delete user.passwordDigest;
          return user;
        })
      : users;
  },
  async setRole(id, role) {
    const collection = await mongoCollections.users();
    if (typeof id !== "string")
      throw `ID must be a string. Received ${typeof id}`;
    if (!id || !(id = id.trim())) throw `ID cannot be empty.`;
    if (!ObjectID.isValid(id)) throw `ID is not a valid BSON ID.`;

    if (typeof role !== "string")
      throw `Role must be a string. Receieved ${typeof role}`;
    if (!role || !(role = role.trim())) throw `Role cannot be empty.`;

    const objId = ObjectID(id);
    const { modifiedCount } = await collection.updateOne(
      { _id: objId },
      { $set: { role: role } }
    );
    if (modifiedCount === 0) throw `Could not update a user with id ${id}`;
    return true;
  },
  async updateUser(id,userObj){
    checkString(id, "id");
    let parsedId = ObjectID(id);
    await checkUserObj(userObj);
    let avatarUrl = "";
    
    const user = await this.getUserById(id);
    username = userObj.username.toLowerCase();

    if(typeof userObj.avatar !== "string"){
      initCloud();
      let resultUpload = await uploadImage(userObj.avatar);
      avatarUrl = resultUpload.secure_url;
      let deleteExisting = await deleteImage(user.avatar);
    }
    else{
      avatarUrl = userObj.avatar;
    }

  
    const userCollection = await users();
    let updatedUser = {
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      username: username,
      nickname: userObj.nickname,
      email: userObj.email,
      discordtag: userObj.discordtag,
      passwordDigest: userObj.passwordDigest,
      //can't change role through update user method
      role: user.role,
      biography: userObj.biography,
      avatar: avatarUrl,
      activePlayers: user.activePlayers
    };
    const updatedInfo = await userCollection.updateOne(
      { _id: parsedId },
      { $set: updatedUser }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not update user successfully";
    }
    return user;
  },

  // Updates user object to add player into array
  // Also updates team object with new player
  async addPlayer(user, game, team, position, isStarter, isCaptain){
    checkString(user, "addPlayer username");
    checkString(game, "addPlayer game");
    checkString(team, "addPlayer team");
    checkString(position, "addPlayer position");

    const userCollection = await users();
    const teamCollection = await teams();
    const userToUpdate = await this.getUser(user);

    if(typeof(isStarter) != 'boolean') throw `Error: input ${isStarter} for isStarter is not a boolean.`;
    if(typeof(isCaptain) != 'boolean') throw `Error: input ${isCaptain} for isCaptain is not a boolean.`;
    
    position = position.trim()

    // Gets player array and appends to it
    userToUpdate.activePlayers.push(
      {
        game: game,
        team: team,
        position: position,
        isStarter: isStarter,
        isCaptain: isCaptain
      }
    );

    let updatedUser = {
      firstName: userToUpdate.firstName,
      lastName: userToUpdate.lastName,
      username: userToUpdate.username,
      nickname: userToUpdate.nickname,
      email: userToUpdate.email,
      discordtag: userToUpdate.discordtag,
      passwordDigest: userToUpdate.passwordDigest,
      role: userToUpdate.role,
      biography: userToUpdate.biography,
      avatar: userToUpdate.avatar,
      activePlayers: userToUpdate.activePlayers
    };

    const returnval = await userCollection.updateOne(
        { _id: userToUpdate._id },
        { $set: updatedUser }
    );

    if(returnval.modifiedCount === 0) throw "Error: Could not update user with player!";

    // Now updates team object with new player
    let teamToUpdate = await teamCollection.findOne({
      name: team
    });

    const returnVal = await teamCollection.updateOne(
      { _id: teamToUpdate._id },
      { $push: {players: userToUpdate._id}}
    );

    if(returnVal.modifiedCount === 0){
      throw `Could not update team with new roster`;
    }

    return userToUpdate;
  },

  // Removes player from user based on team
  // Removes player from team object
  async deletePlayer(username, team){
    checkString(username, 'username');

    const userCollection = await users();
    let userToUpdate = await this.getUser(username);

    let playerArray = user.activePlayers.filter(function(obj){
      return obj.team !== team;
    });

    let updatedUser = {
      firstName: userToUpdate.firstName,
      lastName: userToUpdate.lastName,
      username: userToUpdate.username,
      nickname: userToUpdate.nickname,
      email: userToUpdate.email,
      discordtag: userToUpdate.discordtag,
      passwordDigest: userToUpdate.passwordDigest,
      role: userToUpdate.role,
      biography: userToUpdate.biography,
      avatar: userToUpdate.avatar,
      activePlayers: playerArray
    };

    const returnval = await userCollection.updateOne(
        { _id: userToUpdate._id },
        { $set: updatedUser }
    );

    if(returnval.modifiedCount === 0){
        throw `Could not delete player with username: ${username}`;
    }

    // Removes player id from teanm object
    let teamToUpdate = await teamCollection.find({
      name: team
    });

    const returnVal = await teamCollection.updateOne(
      { _id: teamToUpdate._id },
      { $pull: {players: userToUpdate._id}}
    );

    if(returnVal.modifiedCount === 0){
      throw `Could not update team with new roster`;
    }

    return `Player with username: ${username} successfully deleted.`;
  },
  
  /**
   * Deletes users (also deletes associated avatar if not default)
   * Retroactively deletes player objects in team documents as well
   */
  async deleteUser(id){
    checkString(id, "id");

    const userCollection = await users();
    const teamCollection = await teams();

    let user = await this.getUserById(id);
    let avatar = await user.avatar;

    let result_teams = await teamCollection.find({
      players: {$in: [ObjectID(id)]},
    }).toArray();

    // Loops through all teams and removes the player id from the array and updates db
    for(let i = 0; i < result_teams.length; i++){
      const returnVal = await teamCollection.updateOne(
        { _id: result_teams[i]._id },
        { $pull: {players: ObjectID(id)}}
      );

      if(returnVal.modifiedCount === 0){
        throw `Could not update team with new roster`;
      }
    }

    initCloud();
    let response = await deleteImage(avatar);

    const result = await userCollection.deleteOne({
      _id: ObjectID(user._id),
    });
    if(result.deletedCount !== 1)
      throw "Could not delete user successfully";

    return user;
  }
};
