const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const match = data.match;
const game = data.game;
const teams = data.teams;
const users = data.users;
const playerData = data.players;

require("dotenv").config();

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const game1 = await game.addGame({
    title: "League of Legends",
    categories: ["MOBA", "Strategy"],
  });
  const game2 = await game.addGame({
    title: "Counter-Strike: Global Offensive",
    categories: ["FPS", "Strategy"],
  });

  const Jerry_user = await users.addUser(
    "Jerry",
    "Cheng",
    "jerrytd579",
    "jcheng15@stevens.edu",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "Jerrytd579",
    "https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png",
    "This is my bio"
  );
  const Jerry_player = await playerData.addPlayer(
    "jerrytd579",
    "ADC",
    true,
    false
  );
  const jerry = await playerData.getPlayerByUsername("jerrytd579");
  const jerry_id = jerry._id;

  const Andrew_user = await users.addUser(
    "Andrew",
    "Chuah",
    "sheathblade",
    "achuah@stevens.edu",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "Sheathblade",
    "https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png",
    "This is andrews bio"
  );
  const Andrew_player = await playerData.addPlayer(
    "sheathblade",
    "Top",
    true,
    false
  );
  const andrew = await playerData.getPlayerByUsername("sheathblade");
  const andrew_id = andrew._id;

  const Ryan_user = await users.addUser(
    "Ryan",
    "Hartman",
    "strider",
    "rhartman1@stevens.edu",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "Strider",
    "https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png",
    "This is ryans bio",
    "administrator"
  );
  const Ryan_player = await playerData.addPlayer("strider", "IGL", true, true);
  const ryan = await playerData.getPlayerByUsername("strider");
  const ryan_id = ryan._id;

  const Dan_user = await users.addUser(
    "Daniel",
    "Pekata",
    "gamble",
    "dpekata@stevens.edu",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "Gamble",
    "https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png",
    "This is dans bio"
  );
  const Dan_player = await playerData.addPlayer("gamble", "AWPer", true, false);
  const dan = await playerData.getPlayerByUsername("gamble");
  const dan_id = dan._id;

  const Jerry_two_user = await users.addUser(
    "Jerry",
    "Chen",
    "dragoblin",
    "jchen103@stevens.edu",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "Dragoblin",
    "https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png",
    "This is jerry chens bio"
  );
  const Jerry_two_player = await playerData.addPlayer(
    "dragoblin",
    "Tank",
    true,
    false
  );
  const jerry_chen = await playerData.getPlayerByUsername("dragoblin");
  const jerry_chen_id = jerry_chen._id;

  const Patrick_user = await users.addUser(
    "Patrick",
    "Hill",
    "graffixnyc",
    "phill@stevens.edu",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "graffixnyc",
    "https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png",
    "This is patricks bio"
  );
  const Patrick_player = await playerData.addPlayer(
    "graffixnyc",
    "Support",
    true,
    false
  );
  const patrick = await playerData.getPlayerByUsername("graffixnyc");
  const patrick_id = patrick._id;

  const team_one = await teams.addTeam(
    "Stevens LoL Red",
    "Varsity",
    "League of Legends",
    [jerry_id, andrew_id]
  );
  const team_two = await teams.addTeam(
    "Stevens CSGO Red",
    "Varsity",
    "Counter-Strike: Global Offensive",
    [ryan_id, dan_id]
  );
  const team_three = await teams.addTeam(
    "Stevens Overwatch Gray",
    "Junior Varsity",
    "Overwatch",
    [jerry_chen_id, patrick_id]
  );

  const match1 = await match.addMatch({
    opponent: "Some other team",
    game: game1._id,
    team: team_one.name,
    date: new Date("April 17, 2021 3:00"),
    result: "Loss",
    opponentScore: 2,
    teamsScore: 1,
    matchType: "League of Legends",
  });
  const match2 = await match.addMatch({
    opponent: "Some other team",
    game: game1._id,
    team: team_one.name,
    date: new Date("June 17, 2021 3:00"),
    result: "Win",
    opponentScore: 2,
    teamsScore: 3,
    matchType: "League of Legends",
  });
  const match3 = await match.addMatch({
    opponent: "Some other team",
    game: game2._id,
    team: team_two.name,
    date: new Date("June 29, 2020 3:00"),
    result: "Win",
    opponentScore: 2,
    teamsScore: 3,
    matchType: "Counter-Strike: Global Offensive",
  });

  resolved_matches = await match.get_resolved();
  console.log(resolved_matches);
  console.log("Done seeding database");

  await db.serverConfig.close();
}

main();
