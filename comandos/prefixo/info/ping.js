module.exports = {
    name: 'ping',
    description: 'Mostra o ping do bot',

    execute(message, args) {
        message.channel.send('pong!')
    },
};