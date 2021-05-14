const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const match = data.match;

const users = data.users;
const players = data.players;

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();

    const Jerry_user = await users.addUser('Jerry', 'Cheng', 'jcheng15@stevens.edu', '', 'jerrytd579', 'https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.pngdefault', 'This is my bio');
    const Jerry_player = await players.addPlayer('jcheng15@stevens.edu', 'ADC', true, false);

    const match1 = await match.addMatch({
        opponent: "Some other team",
        game: 1,
        team: 1,
        date: new Date('April 17, 2021 3:00'),
        result: "Loss",
        opponentScore: 2,
        teamsScore: 1,
        matchType: "League of Legends"
    });
    const match2 = await match.addMatch({
        opponent: "Some other team",
        game: 1,
        team: 1,
        date: new Date('June 17, 2021 3:00'),
        result: "Win",
        opponentScore: 2,
        teamsScore: 3,
        matchType: "League of Legends"
    });
    const match3 = await match.addMatch({
        opponent: "Some other team",
        game: 2,
        team: 1,
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