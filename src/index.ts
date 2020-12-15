require('dotenv').config()
import DiscordRepo from './repos/DiscordRepo';
import LeagueRepo from './repos/LeagueRepo';
import users from './users';
import GameOutcome from './dataStructures/GameOutcome';
import Message from './dataStructures/Message';

(async () => {
  const discordRepo = new DiscordRepo(process.env.DISCORD_BOT_TOKEN as string);
  const leagueRepo = new LeagueRepo(process.env.RIOT_API_TOKEN as string);

  await discordRepo.login();

  Promise.all(users.map(async (user) => {
    const latestGameDetails = await leagueRepo.getLatestGameDetailsByUsername(user.username);

    if (user.lastGameId === latestGameDetails.gameDetails.gameId) return;
    else user.lastGameId = latestGameDetails.gameDetails.gameId;

    const userGameDetails = latestGameDetails.gameDetailsForUser;

    await discordRepo.sendMessage(createMessage({
      username: user.username,
      gameOutcome: userGameDetails.stats.win ? GameOutcome.VICTORIOUS : GameOutcome.DEFEATED,
      kills: userGameDetails.stats.kills,
      deaths: userGameDetails.stats.deaths,
      assists: userGameDetails.stats.assists,
      damageDealt: userGameDetails.stats.totalDamageDealtToChampions
    }));
  }));

  function createMessage(message: Message) {
    return `${message.username} was ${message.gameOutcome}! 
K/D/A: ${message.kills}/${message.deaths}/${message.assists} Damage done: ${message.damageDealt}`
  }
})();
