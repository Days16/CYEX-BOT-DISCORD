const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Clan = require('../models/Clan');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('money')
        .setDescription('Gestiona el dinero del clan')
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('Ver el dinero total del clan'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Añadir dinero al clan')
                .addNumberOption(option =>
                    option.setName('amount')
                        .setDescription('Cantidad a añadir')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Descripción de la transacción')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Quitar dinero del clan')
                .addNumberOption(option =>
                    option.setName('amount')
                        .setDescription('Cantidad a quitar')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('description')
                        .setDescription('Descripción de la transacción')
                        .setRequired(true))),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const clan = await Clan.getClan();

        switch (subcommand) {
            case 'view': {
                const embed = new EmbedBuilder()
                    .setTitle('💰 Dinero del Clan CYEX')
                    .setColor('#00ff00')
                    .addFields(
                        { name: 'Dinero Total', value: `${clan.totalMoney}€`, inline: true }
                    );

                const recentTransactions = await Clan.getRecentTransactions();
                if (recentTransactions.length > 0) {
                    const transactionsList = recentTransactions.map(t => 
                        `${t.amount > 0 ? '➕' : '➖'} ${Math.abs(t.amount)}€ - ${t.description} (${t.username})`
                    ).join('\n');
                    
                    embed.addFields({ name: 'Últimas Transacciones', value: transactionsList });
                }

                await interaction.reply({ embeds: [embed] });
                break;
            }

            case 'add': {
                const amount = interaction.options.getNumber('amount');
                const description = interaction.options.getString('description');

                await Clan.updateMoney(amount, description, interaction.user.id, interaction.user.username);

                const embed = new EmbedBuilder()
                    .setTitle('✅ Dinero Añadido')
                    .setColor('#00ff00')
                    .addFields(
                        { name: 'Cantidad', value: `${amount}€`, inline: true },
                        { name: 'Descripción', value: description, inline: true }
                    );

                await interaction.reply({ embeds: [embed] });
                break;
            }

            case 'remove': {
                const amount = -interaction.options.getNumber('amount');
                const description = interaction.options.getString('description');

                if (clan.totalMoney < Math.abs(amount)) {
                    return interaction.reply({
                        content: '❌ No hay suficiente dinero en el clan',
                        ephemeral: true
                    });
                }

                await Clan.updateMoney(amount, description, interaction.user.id, interaction.user.username);

                const embed = new EmbedBuilder()
                    .setTitle('✅ Dinero Retirado')
                    .setColor('#ff0000')
                    .addFields(
                        { name: 'Cantidad', value: `${Math.abs(amount)}€`, inline: true },
                        { name: 'Descripción', value: description, inline: true }
                    );

                await interaction.reply({ embeds: [embed] });
                break;
            }
        }
    },
}; 