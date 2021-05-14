const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const match = data.match;
// const reviews = data.reviews;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();

    const match1 = await match.addMatch({
        opponent: "Some other team",
        game: 1,
        team: 1,
        date: new Date('April 17, 2021 3:00'),
        result: "Loss",
        opponentScore: 2,
        teamsScore: 1,
        matchType: "LoL"
    });
    const match2 = await match.addMatch({
        opponent: "Some other team",
        game: 1,
        team: 1,
        date: new Date('June 17, 2021 3:00'),
        result: "Win",
        opponentScore: 2,
        teamsScore: 3,
        matchType: "LoL"
    });
    const match3 = await match.addMatch({
        opponent: "Some other team",
        game: 2,
        team: 1,
        date: new Date('June 29, 2020 3:00'),
        result: "Win",
        opponentScore: 2,
        teamsScore: 3,
        matchType: "CSGO"
    });
    resolved_matches = await match.get_resolved();
    console.log(resolved_matches);
    console.log('Done seeding database');

    await db.serverConfig.close();
}

main();