const axios = require('axios');

export default class LeagueRepo {
  private apiToken: string;

  constructor($apiToken: string) {
    this.apiToken = $apiToken;
  }

  async getMatchHistory(accountId: string) {
    return axios.get(`https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}`, {
      headers: {
        "X-Riot-Token": this.apiToken
      }
    })
      .then((res: any) => res.data.matches);
  }

  async getAccountIdByUsername(username: string) {
    return axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${username}`, {
      headers: {
        "X-Riot-Token": this.apiToken
      }
    })
      .then((res: any) => res.data.accountId);
  }

  async getGameDetailsById(gameId: number) {
    return axios.get(`https://euw1.api.riotgames.com/lol/match/v4/matches/${gameId}`, {
      headers: {
        "X-Riot-Token": this.apiToken
      }
    })
      .then((res: any) => res.data);
  }

  async getLatestGameDetailsByUsername(username: string) {
    const accountId = await this.getAccountIdByUsername(username);
    const matchHistory = await this.getMatchHistory(accountId)
    const latestMatchPlayedId = matchHistory[0].gameId;

    const gameDetails = await this.getGameDetailsById(latestMatchPlayedId)
    const participantId = gameDetails.participantIdentities
      .find((participant: any) => participant.player.summonerName === username).participantId;

    const gameDetailsForUser = gameDetails.participants
      .find((participant: any) => participant.participantId === participantId);

    return {
      gameDetails,
      gameDetailsForUser
    }
  }

  async getImageByChampionId(id: number) {
    const response = await axios.get(`http://ddragon.leagueoflegends.com/cdn/10.25.1/data/en_US/champion.json`, {
      headers: {
        "X-Riot-Token": this.apiToken
      }
    })
      .then((res: any) => res.data);

    let championName;
    for (const [key, value] of Object.entries(response.data)) {
      // @ts-ignore
      if (value.key == `${id}`) championName = value.id;
    }
    return `http://ddragon.leagueoflegends.com/cdn/10.25.1/img/champion/${championName}.png`
  }
}