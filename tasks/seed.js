const dbConnection = require("../config/mongoConnection");
const data = require("../data/");
const match = data.match;
const game = data.game;
const teams = data.teams;
const users = data.users;

require("dotenv").config();

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  const game1 = await game.addGame({
    gameName: "League of Legends",
    image: "https://res.cloudinary.com/stevens-esports/image/upload/v1620962778/logos/league_logo_2.png",
  });
  const game2 = await game.addGame({
    gameName: "Counter-Strike: Global Offensive",
    image: "https://res.cloudinary.com/stevens-esports/image/upload/v1620962777/logos/csgo_logo.png"
  });
  const game3 = await game.addGame({
    gameName: "Valorant",
    image: "https://res.cloudinary.com/stevens-esports/image/upload/v1620962778/logos/valorant_logo.png"
  });
  const game4 = await game.addGame({
    gameName: "Overwatch",
    image: "https://res.cloudinary.com/stevens-esports/image/upload/v1620962777/logos/overwatch_logo.png"
  });
  const game5 = await game.addGame({
    gameName: "Hearthstone",
    image: "https://res.cloudinary.com/stevens-esports/image/upload/v1620962777/logos/hearthstone_logo.png"
  });
  const game6 = await game.addGame({
    gameName: "Rocket League",
    image: "https://res.cloudinary.com/stevens-esports/image/upload/v1620962777/logos/rocket_league_logo.png"
  });
  const game7 = await game.addGame({
    gameName: "Rainbow Six Siege",
    image: "https://res.cloudinary.com/stevens-esports/image/upload/v1620962777/logos/r6_logo.png"
  });
  const game8 = await game.addGame({
    gameName: "Call of Duty",
    image: "https://res.cloudinary.com/stevens-esports/image/upload/v1620962777/logos/cod_logo.png"
  });

  const team_one = await teams.addTeam(
    "Stevens LoL Red",
    "Varsity",
    "League of Legends"
  );
  const team_two = await teams.addTeam(
    "Stevens CSGO Red",
    "Varsity",
    "Counter-Strike: Global Offensive"
  );
  const team_three = await teams.addTeam(
    "Stevens Overwatch Gray",
    "Junior Varsity",
    "Overwatch"
  );

  const Jerry_user = await users.addUser(
    "Jerry",
    "Cheng",
    "jerrytd579",
    "jcheng15@stevens.edu",
    "Test1#1234",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "Jerrytd579",
    "This is my bio"
  );
  const Jerry_player = await users.addPlayer(
    "jerrytd579",
    "League of Legends",
    "Stevens LoL Red",
    "ADC",
    true,
    false
  );
  const jerry = await users.getUser("jerrytd579");
  const jerry_id = jerry._id;

  const Andrew_user = await users.addUser(
    "Andrew",
    "Chuah",
    "sheathblade",
    "achuah@stevens.edu",
    "Test2#1234",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "Sheathblade",
    "This is andrews bio"
  );
  const Andrew_player = await users.addPlayer(
    "sheathblade",
    "League of Legends",
    "Stevens LoL Red",
    "Top",
    true,
    false
  );
  const andrew = await users.getUser("sheathblade");
  const andrew_id = andrew._id;

  const Ryan_user = await users.addUser(
    "Ryan",
    "Hartman",
    "strider",
    "rhartman1@stevens.edu",
    "Test3#1234",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "Strider",
    "This is ryans bio",
    "administrator"
  );
  const Ryan_player = await users.addPlayer(
    "strider",
    "Counter-Strike: Global Offensive",
    "Stevens CSGO Red",
    "IGL",
    true,
    true
  );
  const ryan = await users.getUser("strider");
  const ryan_id = ryan._id;

  const Dan_user = await users.addUser(
    "Daniel",
    "Pekata",
    "gamble",
    "dpekata@stevens.edu",
    "Test4#1234",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "Gamble",
    "This is dans bio"
  );
  const Dan_player = await users.addPlayer(
    "gamble",
    "Counter-Strike: Global Offensive",
    "Stevens CSGO Red",
    "AWPer",
    true,
    false
  );
  const dan = await users.getUser("gamble");
  const dan_id = dan._id;

  const Jerry_two_user = await users.addUser(
    "Jerry",
    "Chen",
    "dragoblin",
    "jchen103@stevens.edu",
    "Test5#1234",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "Dragoblin",
    "This is jerry chens bio"
  );
  const Jerry_two_player = await users.addPlayer(
    "dragoblin",
    "Overwatch",
    "Stevens Overwatch Gray",
    "Tank",
    true,
    false
  );
  const jerry_chen = await users.getUser("dragoblin");
  const jerry_chen_id = jerry_chen._id;

  const Patrick_user = await users.addUser(
    "Patrick",
    "Hill",
    "graffixnyc",
    "phill@stevens.edu",
    "Test6#1234",
    "$2b$16$nrS5Y/yojRkIJKVmX79PFOpeZE/gcAMg3/1BtVF2DOomgiw.HCq6u",
    "graffixnyc",
    "This is patricks bio"
  );
  const Patrick_player = await users.addPlayer(
    "graffixnyc",
    "Overwatch",
    "Stevens Overwatch Gray",
    "Support",
    true,
    false
  );
  const patrick = await users.getUser("graffixnyc");
  const patrick_id = patrick._id;

  const match1 = await match.addMatch({
    opponent: "Some other team",
    game: game1._id,
    team: team_one.name,
    date: "April 17, 2021 3:00",
    result: "Loss",
    opponentScore: 2,
    teamsScore: 1,
    matchType: "League of Legends",
  });
  const match2 = await match.addMatch({
    opponent: "Some other team",
    game: game1._id,
    team: team_one.name,
    date: "June 17, 2021 3:00",
    result: "Win",
    opponentScore: 2,
    teamsScore: 3,
    matchType: "League of Legends",
  });
  const match3 = await match.addMatch({
    opponent: "Some other team",
    game: game2._id,
    team: "Stevens CSGO Red",
    date: "June 29, 2020 3:00",
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
