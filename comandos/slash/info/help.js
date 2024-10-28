const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: {
        name: 'help',
        description: 'Mostra todos os comandos disponíveis',
    },
        
    async execute(interaction) {
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
                const commandName = command.data ? command.data.name : command.name;
                const commandDescription = command.data ? command.data.description : command.description;
                
                categoryEmbed.addFields({
                    name: `\`${commandName}\``,
                    value: commandDescription || 'Sem descrição disponível'
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
        await interaction.reply({ embeds: [embed], components: [row] });

        // Criar coletor para o menu
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async i => {
            if (!i.isStringSelectMenu()) return;

            const selectedCategory = i.values[0];
            const commandFiles = fs.readdirSync(path.join(__dirname, `../${selectedCategory}`))
                .filter(file => file.endsWith('.js'));

            const commands = commandFiles.map(file => 
                require(path.join(__dirname, `../${selectedCategory}`, file))
            );

            const newEmbed = createCategoryEmbed(selectedCategory, commands);
            const newRow = createSelectMenu(categories, selectedCategory);

            await i.update({ embeds: [newEmbed], components: [newRow] });
        });

        collector.on('end', () => {
            interaction.editReply({ components: [] });
        });
    }
};
