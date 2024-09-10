const { Client, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();

const loadSlashCommands = require('./handlers/comandos-slash');
const loadPrefixCommands = require('./handlers/comandos-prefixo');

loadSlashCommands(client);
loadPrefixCommands(client);

client.once('ready', () => {
  console.log(`${client.user.tag} Está online!!`);
});

// Comandos slash
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Houve um erro ao executar este comando!', ephemeral: true });
  }
});

// Comandos de prefixo
client.on('messageCreate', (message) => {
  const prefix = process.env.PREFIX;

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.prefixCommands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Houve um erro ao executar este comando!');
  }
});

client.login(process.env.TOKEN);