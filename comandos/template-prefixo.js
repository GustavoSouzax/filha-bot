const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'nome-do-comando',
  description: 'Descrição do comando',
  aliases: ['alias1', 'alias2'],
  // Opcional: Adicione mais propriedades conforme necessário
  usage: '[argumento]',
  cooldown: 5,

  async execute(message, args) {
    // args já vem como array de argumentos
    const argumento = args[0];
    // Base do embed
    const embed = new EmbedBuilder()
      .setTitle('Título')
      .setDescription('Descrição')
      .addFields(
        { name: 'Campo 1', value: 'Valor 1', inline: true },
        { name: 'Campo 2', value: 'Valor 2', inline: true }
      )
      .setColor(0x00AE86)
      .setFooter({ 
        text: `Solicitado por ${message.author.tag}`, 
        iconURL: message.author.displayAvatarURL({ dynamic: true }) 
      });

    await message.reply({ embeds: [embed] });
  },
};
