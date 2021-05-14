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

    const Jerry_user = await users.addUser('Jerry', 'Cheng', 'jcheng15@stevens.edu', '', 'jerrytd579', 'https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png', 'This is jerry chengs bio');
    const Jerry_player = await playerData.addPlayer('jcheng15@stevens.edu', 'ADC', true, false);
    const jerry = await playerData.getPlayerByUsername('jcheng15@stevens.edu');
    const jerry_id = jerry._id;

    const Andrew_user = await users.addUser('Andrew', 'Chuah', 'achuah3@stevens.edu', '', 'Sheathblade', 'https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png', 'This is andrews bio');
    const Andrew_player = await playerData.addPlayer('achuah@stevens.edu', 'Top', true, false);
    const andrew = await playerData.getPlayerByUsername('achuah@stevens.edu');
    const andrew_id = andrew._id;

    const Ryan_user = await users.addUser('Ryan', 'Hartman', 'rhartman3@stevens.edu', '', 'Strider', 'https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png', 'This is ryans bio');
    const Ryan_player = await playerData.addPlayer('rhartman1@stevens.edu', 'IGL', true, true);
    const ryan = await playerData.getPlayerByUsername('rhartman1@stevens.edu');
    const ryan_id = ryan._id;

    const Dan_user = await users.addUser('Daniel', 'Pekata', 'dpekata@stevens.edu', '', 'gamble', 'https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png', 'This is dans bio');
    const Dan_player = await playerData.addPlayer('dpekata@stevens.edu', 'AWPer', true, false);
    const dan = await playerData.getPlayerByUsername('dpekata@stevens.edu');
    const dan_id = dan._id;

    const Jerry_two_user = await users.addUser('Jerry', 'Chen', 'jchen103@stevens.edu', '', 'Dragoblin', 'https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png', 'This is jerry chens bio');
    const Jerry_two_player = await playerData.addPlayer('jchen103@stevens.edu', 'Tank', true, false);
    const jerry_chen = await playerData.getPlayerByUsername('jchen103@stevens.edu');
    const jerry_chen_id = jerry_chen._id;

    const Patrick_user = await users.addUser('Patrick', 'Hill', 'phill@stevens.edu', '', 'graffixnyc', 'https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.png', 'This is patricks bio');
    const Patrick_player = await playerData.addPlayer('phill@stevens.edu', 'Support', true, false);
    const patrick = await playerData.getPlayerByUsername('phill@stevens.edu');
    const patrick_id = patrick._id;

    const team_one = await teams.addTeam("Stevens LoL Red", "Varsity", "League of Legends", [jerry_id, andrew_id]);
    const team_two = await teams.addTeam("Stevens CSGO Red", "Varsity", "Counter Strike Global Offenseive", [ryan_id, dan_id]);
    const team_three = await teams.addTeam("Stevens Overwatch Gray", "Junior Varsity", "Overwatch", [jerry_chen_id, patrick_id]);

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