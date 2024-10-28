const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: {
    name: 'nome-do-comando',
    description: 'Descrição do comando',
    // Opcional...
    options: [
      {
        name: 'argumento',
        description: 'Descrição do argumento',
        type: 3, // 3 = String 4 = Integer 5 = Boolean
        required: true
      }
    ]
  },

  async execute(interaction) {
    // Pegar argumentos (se houver)
    const argumento = interaction.options.getString('argumento');

    const embed = new EmbedBuilder()
      .setTitle('Título do Embed')
      .setDescription('Descrição do embed')
      .addFields(
        { name: 'Campo 1', value: 'Valor 1', inline: true },
        { name: 'Campo 2', value: 'Valor 2', inline: true }
      )
      .setColor(0x00AE86)
      .setFooter({ 
        text: `Solicitado por ${interaction.user.tag}`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
      });

    await interaction.reply({ embeds: [embed] });
  },
};
