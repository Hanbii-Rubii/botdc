const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const http = require('http');

// Web server mini bawaan Node.js (tanpa install library tambahan)
http.createServer((req, res) => {
  res.write("Bot VC 24/7 Aktif Nonstop!");
  res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// Data Bot Kamu
const TOKEN = 'MTU2ODY5NjAxOTA5NTUyNzQ3NA.GPjloe.mi19coAtm0tIg-qXfmN4tNoFDV8L8q0l9i9X_U';
const GUILD_ID = '1533435438851952702';
const CHANNEL_ID = '1533435439359459484';

function connectToVoice() {
  const guild = client.guilds.cache.get(GUILD_ID);
  if (!guild) {
    console.error('Server tidak ditemukan!');
    return;
  }

  const connection = joinVoiceChannel({
    channelId: CHANNEL_ID,
    guildId: GUILD_ID,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
    selfMute: false
  });

  connection.on(VoiceConnectionStatus.Disconnected, async () => {
    try {
      await Promise.race([
        entersState(connection, VoiceConnectionStatus.Signalling, 5000),
        entersState(connection, VoiceConnectionStatus.Connecting, 5000),
      ]);
    } catch (error) {
      console.log('Voice terputus, mencoba hubungkan ulang...');
      connection.destroy();
      connectToVoice();
    }
  });

  console.log(`[BERHASIL] Bot standby di Voice Channel: ${CHANNEL_ID}`);
}

client.on('ready', () => {
  console.log(`[ONLINE] Logged in sebagai ${client.user.tag}`);
  connectToVoice();
});

client.login(TOKEN);
