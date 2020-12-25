import GameOutcome from './GameOutcome';

export default interface Message {
  username: string,
  gameOutcome: GameOutcome,
  kills: number,
  deaths: number,
  assists: number,
  damageDealt: number,
  championImage: string,
  timeCCingOthers: string,
  totalMinionsKilled: number,
  visionWardsBoughtInGame: number,
  totalHeal: number,
  longestTimeSpentLiving: string,
}