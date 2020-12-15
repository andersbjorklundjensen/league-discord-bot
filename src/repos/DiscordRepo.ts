
const Discord = require('discord.js');
const client = new Discord.Client();

export default class DiscordRepo {
  private discordBotToken: string;

  public constructor($discordBotToken: string) {
    this.discordBotToken = $discordBotToken;
  }

  public async login() {
    return new Promise((resolve) => {
      client.login(this.discordBotToken);
      client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        resolve(true);
      });
    });
  }

  private getTextChannelId() {
    const channels = client.channels.cache;
    for (let [key, value] of channels) {
      if (value.type === "text" && value.name === process.env.DISCORD_CHANNEL_NAME)
        return value.id;
    }
  }

  public sendMessage(content: string) {
    const channelId = this.getTextChannelId();
    client.channels.cache.get(channelId).send(content);
  }
}