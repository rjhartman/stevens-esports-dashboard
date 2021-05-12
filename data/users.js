const mongoCollections = require("../config/mongoCollections");

module.exports = {
  async getUser(username) {
    const collection = await mongoCollections.users();
    if (typeof username !== "string")
      throw `Username/email must be a string! Recieved ${typeof username}`;
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
};
