const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Mostra o ping do bot',

  execute(message, args) {
    const memoriaUsada = process.memoryUsage().heapUsed / 1024 / 1024;
    const tempoInicial = Date.now();

    message.channel.send('Calculando ping...').then(sentMessage => {
      const tempoFinal = Date.now();
      const latencia = tempoFinal - tempoInicial;

      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('Pong!')
        .addFields(
          { name: '💾 Memória', value: `${memoriaUsada.toFixed(2)} MB`, inline: true },
          { name: '📡 Latência', value: `${latencia}ms`, inline: true }
        )
        .setTimestamp();

      sentMessage.edit({ content: '', embeds: [embed] });
    });
  },
};