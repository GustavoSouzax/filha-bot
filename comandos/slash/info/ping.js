const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mostra o ping do bot'),

  async execute(interaction) {
    const memoriaUsada = process.memoryUsage().heapUsed / 1024 / 1024;
    const tempoInicial = Date.now();

    await interaction.reply('Calculando ping...');

    const tempoFinal = Date.now();
    const latencia= tempoFinal - tempoInicial;
    const embed = new EmbedBuilder()
      .setColor(0x00FF00)
      .setTitle('Pong!')
      .addFields(
        { name: '💾 Memória', value: `${memoriaUsada.toFixed(2)} MB`, inline: true },
        { name: '📡 Latência', value: `${latencia}ms`, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ content: '', embeds: [embed] });
  },
};