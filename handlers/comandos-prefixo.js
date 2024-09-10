const fs = require('fs');
const path = require('path');

module.exports = (client) => {
  const prefixCommandsPath = path.join(__dirname, '../comandos/prefixo');
  fs.readdirSync(prefixCommandsPath).forEach(category => {
    const categoryPath = path.join(prefixCommandsPath, category);
    if (fs.lstatSync(categoryPath).isDirectory()) {
      const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const command = require(`${categoryPath}/${file}`);
        client.prefixCommands.set(command.name, command);
      }
    }
  });
};