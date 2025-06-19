const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Clan = require('../models/Clan');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Muestra estadísticas financieras del clan'),

    async execute(interaction) {
        const clan = await Clan.getClan();
        const transactions = Array.isArray(clan.transactions) ? clan.transactions : [];
        const contributions = Array.isArray(clan.contributions) ? clan.contributions : [];

        const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
        const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + Math.abs(b.amount), 0);

        // Top contribuidores
        const topArray = Object.entries(
            contributions.reduce((acc, c) => {
                acc[c.username] = (acc[c.username] || 0) + c.amount;
                return acc;
            }, {})
        ).sort((a, b) => b[1] - a[1]).slice(0, 5);

        const embed = new EmbedBuilder()
            .setTitle('📊 Estadísticas del Clan')
            .setColor('#0099ff')
            .addFields(
                { name: 'Dinero Total', value: `${clan.totalMoney} CYEX`, inline: true },
                { name: 'Total Ingresos', value: `${totalIncome} CYEX`, inline: true },
                { name: 'Total Gastos', value: `${totalExpense} CYEX`, inline: true },
            );
        if (topArray.length > 0) {
            embed.addFields({ name: '🏆 Top Contribuidores', value: topArray.map(([user, total]) => `• ${user}: ${total} CYEX`).join('\n') });
        }
        await interaction.reply({ embeds: [embed] });
    }
}; 