const mongoCollections = require("../config/mongoCollections");
const fs = require('fs');
const streamifier = require('streamifier');
const cloudinary = require("cloudinary").v2;
const { ObjectID } = require("mongodb");

const users = mongoCollections.users;

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

async function checkUserObj(userObj){
    checkString(userObj.firstName, "firstName");
    checkString(userObj.lastName, "lastName");
    checkString(userObj.username, "userName");
    checkString(userObj.nickname, "nickName");
    checkString(userObj.email, "email");
    if(!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(userObj.email))){
      throw `Email not valid format.`
    }
    checkString(userObj.passwordDigest, "passwordDigest");
    checkString(userObj.role, "roleName");
    checkString(userObj.biography, "biography");
    if (!userObj.avatar) throw `no input for avatar`
    if (typeof userObj.avatar !== "string") throw `avatar is not a string`;
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
    passwordDigest,
    nickname,
    avatar,
    bio,
    role = "regular"
  ) {
    const collection = await mongoCollections.users();
    if (typeof username !== "string")
      throw `Username/email must be a string! Received ${typeof username}`;
    if (!username || !(username = username.trim()))
      throw `Username/email cannot be empty.`;

    username = username.toLowerCase();
    
    if (!avatar){
      avatar = "https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png";
    }
    else{
      initCloud();

      let resultUpload = await uploadImage(avatar);
      avatar = resultUpload.secure_url;
    }
    

    const returnVal = await collection.insertOne({
      firstName: firstName,
      lastName: lastName,
      username: username,
      email: email,
      passwordDigest: passwordDigest,
      nickname: nickname,
      role: role,
      biography: bio,
      avatar: avatar,
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
    checkUserObj(userObj);
    const user = await this.getUserById(id);
    username = userObj.username.toLowerCase();

    if (userObj.avatar === ""){
      avatar = user.avatar;
    }
    else{
      initCloud();
      let resultUpload = await uploadImage(avatar);
      avatar = resultUpload.secure_url;
    }
  
    const userCollection = await users();
    let updatedUser = {
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      username: username,
      nickname: userObj.nickname,
      email: userObj.email,
      passwordDigest: userObj.passwordDigest,
      //can't change role through update user method
      role: user.role,
      biography: userObj.biography,
      avatar: avatar
    };
    const updatedInfo = await userCollection.updateOne(
      { _id: parsedId },
      { $set: updatedUser }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "could not update user successfully";
    }
    return user;
  }
};
