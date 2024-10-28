const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'nome-do-comando',
  description: 'Descrição do comando',
  aliases: ['alias1', 'alias2'],
  // Opcional: Adicione mais propriedades conforme necessário
  usage: '[argumento]',
  cooldown: 5,

  async execute(message, args) {
  },
};
