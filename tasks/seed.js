const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const match = data.match;
const teams = data.teams;
const users = data.users;
const playerData = data.players;

require("dotenv").config();

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();

    const Jerry_user = await users.addUser('Jerry', 'Cheng', 'jcheng15@stevens.edu', '', 'jerrytd579', 'https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png', 'This is my bio');
    const Jerry_player = await playerData.addPlayer('jcheng15@stevens.edu', 'ADC', true, false);
    const jerry = await playerData.getPlayerByUsername('jcheng15@stevens.edu');
    const jerry_id = jerry._id;
    const Andrew_user = await users.addUser('Andrew', 'Chuah', 'achuah3@stevens.edu', '', 'Sheathblade', 'https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png', 'This is andrews bio');
    const Andrew_player = await playerData.addPlayer('achuah3@stevens.edu', 'Top', true, false);
    const andrew = await playerData.getPlayerByUsername('achuah3@stevens.edu');
    const andrew_id = andrew._id;

    const team_one = await teams.addTeam("Stevens LoL Red", "Varsity", "League of Legends", [jerry_id, andrew_id]);
    // const id = team_one._id
    console.log(team_one)

    const match1 = await match.addMatch({
        opponent: "Some other team",
        game: 1,
        team: team_one.name,
        date: new Date('April 17, 2021 3:00'),
        result: "Loss",
        opponentScore: 2,
        teamsScore: 1,
        matchType: "League of Legends"
    });
    const match2 = await match.addMatch({
        opponent: "Some other team",
        game: 1,
        team: team_one.name,
        date: new Date('June 17, 2021 3:00'),
        result: "Win",
        opponentScore: 2,
        teamsScore: 3,
        matchType: "League of Legends"
    });
    const match3 = await match.addMatch({
        opponent: "Some other team",
        game: 2,
        team: team_one.name,
        date: new Date('June 29, 2020 3:00'),
        result: "Win",
        opponentScore: 2,
        teamsScore: 3,
        matchType: "Counter-Strike: Global Offensive"
    });

    

    resolved_matches = await match.get_resolved();
    console.log(resolved_matches);
    console.log('Done seeding database');

    await db.serverConfig.close();
}

main();
