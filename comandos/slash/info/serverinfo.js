const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'serverinfo',
  description: 'Mostra as informações do servidor.',

  async execute(message) {
    const { guild } = message;

    const embed = new EmbedBuilder()
      .setTitle(`📊 Informações do servidor: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: '🆔 ID do Servidor', value: `\`${guild.id}\``, inline: false },
        { name: '👑 Proprietário', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 Membros', value: `**${guild.memberCount}**`, inline: true },
        { name: '🌍 Região', value: `**${guild.preferredLocale}**`, inline: true },
        { name: '📅 Criado em', value: `**${guild.createdAt.toDateString()}**`, inline: true },
        { name: '🔐 Nível de Verificação', value: `**${guild.verificationLevel}**`, inline: true }
      )
      .setColor(0x00AE86)
      .setFooter({ text: `Pedido por ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    await message.channel.send({ embeds: [embed] });
  },
};