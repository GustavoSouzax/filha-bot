const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'help',
    description: 'Mostra todos os comandos disponíveis',
    execute(message, args, client) {
        // Função para criar o menu de seleção
        function createSelectMenu(categories, selectedCategory) {
            return new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('help_menu')
                        .setPlaceholder('Selecione uma categoria')
                        .addOptions(categories.map(category => ({
                            label: category.charAt(0).toUpperCase() + category.slice(1),
                            value: category,
                            emoji: category === 'info' ? '📝' : category === 'moderacao' ? '🛡️' : '⚙️',
                            default: category === selectedCategory
                        })))
                );
        }

        // Função para criar embed de categoria
        function createCategoryEmbed(category, commands) {
            const categoryEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`📚 Comandos de ${category.charAt(0).toUpperCase() + category.slice(1)}`)
                .setDescription('Aqui estão todos os comandos desta categoria:');

            commands.forEach(command => {
                categoryEmbed.addFields({
                    name: `\`${command.name}\``,
                    value: command.description || 'Sem descrição disponível'
                });
            });

            return categoryEmbed;
        }

        // Buscar categorias e comandos iniciais
        const categories = fs.readdirSync(path.join(__dirname, '../'))
            .filter(file => !file.includes('.'));

        const defaultCategory = 'info';
        const defaultCommands = fs.readdirSync(path.join(__dirname))
            .filter(file => file.endsWith('.js'))
            .map(file => require(path.join(__dirname, file)));

        // Criar componentes iniciais
        const row = createSelectMenu(categories, defaultCategory);
        const embed = createCategoryEmbed(defaultCategory, defaultCommands);

        // Enviar mensagem inicial
        message.channel.send({ embeds: [embed], components: [row] }).then(msg => {
            // Criar coletor para o menu
            const filter = i => i.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, time: 600000 }); // 5 minutos

            collector.on('collect', async interaction => {
                if (!interaction.isStringSelectMenu()) return;

                const selectedCategory = interaction.values[0];
                const commandFiles = fs.readdirSync(path.join(__dirname, `../${selectedCategory}`))
                    .filter(file => file.endsWith('.js'));

                const commands = commandFiles.map(file => 
                    require(path.join(__dirname, `../${selectedCategory}`, file))
                );

                const newEmbed = createCategoryEmbed(selectedCategory, commands);
                const newRow = createSelectMenu(categories, selectedCategory);

                await interaction.update({ embeds: [newEmbed], components: [newRow] });
            });

            collector.on('end', () => {
                msg.edit({ components: [] });
                message.channel.send('Menu de ajuda expirado. Use o comando novamente se precisar.');
            });
        });
    }
};
