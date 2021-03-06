require('dotenv').config()
import DiscordRepo from './repos/DiscordRepo';
import LeagueRepo from './repos/LeagueRepo';
import users from './users';
import GameOutcome from './dataStructures/GameOutcome';
import Message from './dataStructures/Message';

function convertFromSecondsToMinsAndSecs(seconds: number) {
  let minutes = Math.floor(seconds / 60);
  let secondsLeft = seconds - minutes * 60;
  return `${minutes !== 0 ? `${minutes} min` : ''} ${secondsLeft} sec`;
}

const main = async () => {
  const discordRepo = new DiscordRepo(process.env.DISCORD_BOT_TOKEN as string);
  const leagueRepo = new LeagueRepo(process.env.RIOT_API_TOKEN as string);

  await discordRepo.login();

  Promise.all(users.map(async (user) => {
    const latestGameDetails = await leagueRepo.getLatestGameDetailsByUsername(user.username);

    if (user.lastGameId === latestGameDetails.gameDetails.gameId) return;
    else user.lastGameId = latestGameDetails.gameDetails.gameId;

    const userGameDetails = latestGameDetails.gameDetailsForUser;
    const championImage = await leagueRepo.getImageByChampionId(userGameDetails.championId);

    await discordRepo.sendMessage(createMessage({
      username: user.username,
      gameOutcome: userGameDetails.stats.win ? GameOutcome.VICTORIOUS : GameOutcome.DEFEATED,
      kills: userGameDetails.stats.kills,
      deaths: userGameDetails.stats.deaths,
      assists: userGameDetails.stats.assists,
      damageDealt: userGameDetails.stats.totalDamageDealtToChampions,
      championImage: championImage,
      timeCCingOthers: convertFromSecondsToMinsAndSecs(userGameDetails.stats.timeCCingOthers),
      totalMinionsKilled: userGameDetails.stats.totalMinionsKilled,
      visionWardsBoughtInGame: userGameDetails.stats.visionWardsBoughtInGame,
      totalHeal: userGameDetails.stats.totalHeal,
      longestTimeSpentLiving: convertFromSecondsToMinsAndSecs(userGameDetails.stats.longestTimeSpentLiving),
    }));
  }));

  function createMessage(message: Message) {
    return `${message.username} was ${message.gameOutcome}! 
K/D/A: ${message.kills}/${message.deaths}/${message.assists} 
totalHeal: ${message.totalHeal}
Damage done: ${message.damageDealt}
timeCCingOthers: ${message.timeCCingOthers}
totalMinionsKilled: ${message.totalMinionsKilled}
longestTimeSpentLiving: ${message.longestTimeSpentLiving}
visionWardsBoughtInGame: ${message.visionWardsBoughtInGame}
${message.championImage}`
  }
};

function a() {
  main().catch(e => console.log(e));
}

setInterval(a, 60 * 1000);