const fs = require('fs');
const path = require('path');
// Não mexa
module.exports = (client) => {
  const slashCommandsPath = path.join(__dirname, '../comandos/slash');
  fs.readdirSync(slashCommandsPath).forEach(category => {
    const categoryPath = path.join(slashCommandsPath, category);
    if (fs.lstatSync(categoryPath).isDirectory()) {
      const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const command = require(`${categoryPath}/${file}`);
        client.slashCommands.set(command.data.name, command);
      }
    }
  });
};