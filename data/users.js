const mongoCollections = require("../config/mongoCollections");
const cloudinary = require("cloudinary").v2;
const { ObjectID } = require("mongodb");
require("dotenv").config();

function initCloud() {
  cloudinary.config({
      cloud_name: "stevens-esports",
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

module.exports = {
  async getUser(username) {
    const collection = await mongoCollections.users();
    if (typeof username !== "string")
      throw `Username/email must be a string! Received ${typeof username}`;
    if (!username || !(username = username.trim()))
      throw `Username/email cannot be empty.`;

    // The username may be an email or username. Search for both.
    username = username.toLowerCase();
    initCloud();
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
  async addUser(firstName, lastName, username, password, nickname, avatar, bio) {
    const collection = await mongoCollections.users();
    if (typeof username !== "string")
      throw `Username/email must be a string! Received ${typeof username}`;
    if (!username || !(username = username.trim()))
      throw `Username/email cannot be empty.`;

    username = username.toLowerCase();

    initCloud();

    let resultUpload = cloudinary.uploader.upload(avatar,
      {
        width: 200,
        height: 200,
        x: 0, y: 0,
        crop: "limit",
        folder: "avatars",
      });

    collection.insertOne({
      firstName: firstName,
      lastName: lastName,
      username: username,
      nickname: nickname,
      role: "regular",
      biography: bio,
      avatar: resultUpload.secure_url
    });
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
};
