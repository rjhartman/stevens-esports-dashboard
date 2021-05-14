const dbConnection = require('../config/mongoConnection');
const data = require('../data/');

const users = data.users;
const players = data.players;

async function main(){
    const db = await dbConnection();
    await db.dropDatabase();

    const Jerry_user = await users.addUser('Jerry', 'Cheng', 'jcheng15@stevens.edu', '', 'jerrytd579', 'https://res.cloudinary.com/stevens-esports/image/upload/v1620940207/avatars/default-player.pngdefault', 'This is my bio');
    const Jerry_player = await players.addPlayer('jcheng15@stevens.edu', 'ADC', true, false)
}

main();