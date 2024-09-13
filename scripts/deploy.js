const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const commands = [];

const loadCommands = (dir) => {
  const commandFiles = fs.readdirSync(dir);

  for (const file of commandFiles) {
    const filePath = path.join(dir, file);

    if (fs.lstatSync(filePath).isDirectory()) {
      loadCommands(filePath);
    } 
    else if (file.endsWith('.js')) {
      const command = require(filePath);
      commands.push(command.data.toJSON());
    }
  }
};

loadCommands(path.join(__dirname, '../comandos/slash'));

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Iniciando o deploy dos comandos slash...');

    if (process.env.GUILD_ID) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commands },
      );
      console.log('Comandos slash registrados para a guilda.');
    } else {
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands },
      );
      console.log('Comandos slash registrados globalmente.');
    }
  } catch (error) {
    console.error('Erro ao registrar comandos:', error);
  }
})();