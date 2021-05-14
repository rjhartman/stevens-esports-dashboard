const mongoCollections = require("../config/mongoCollections");
const cloudinary = require("cloudinary").v2;

module.exports = {
  async getUser(username) {
    const collection = await mongoCollections.users();
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

    let resultUpload = await cloudinary.uploader.upload(avatar,
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
  }
};
