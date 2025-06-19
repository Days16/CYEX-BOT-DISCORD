const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Clan = require('../models/Clan');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('money')
        .setDescription('Gestiona la tesorería del clan')
        .addSubcommand(sub =>
            sub.setName('add')
                .setDescription('Añadir ingreso a la tesorería')
                .addNumberOption(opt => opt.setName('cantidad').setDescription('Cantidad a añadir').setRequired(true))
                .addStringOption(opt => opt.setName('descripcion').setDescription('Descripción').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('remove')
                .setDescription('Registrar un gasto')
                .addNumberOption(opt => opt.setName('cantidad').setDescription('Cantidad a quitar').setRequired(true))
                .addStringOption(opt => opt.setName('descripcion').setDescription('Descripción').setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('view')
                .setDescription('Ver el estado de la tesorería')),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        if (sub === 'add') {
            const cantidad = interaction.options.getNumber('cantidad');
            const descripcion = interaction.options.getString('descripcion');
            await Clan.addTransaction(cantidad, descripcion, interaction.user.id, interaction.user.username, 'income');
            await interaction.reply({ content: `✅ Ingreso de ${cantidad} CYEX registrado.`, ephemeral: true });
        } else if (sub === 'remove') {
            const cantidad = interaction.options.getNumber('cantidad');
            const descripcion = interaction.options.getString('descripcion');
            await Clan.addTransaction(-cantidad, descripcion, interaction.user.id, interaction.user.username, 'expense');
            await interaction.reply({ content: `✅ Gasto de ${cantidad} CYEX registrado.`, ephemeral: true });
        } else if (sub === 'view') {
            const clan = await Clan.getClan();
            const embed = new EmbedBuilder()
                .setTitle('💰 Tesorería del Clan')
                .setColor('#00ff00')
                .addFields(
                    { name: 'Dinero Total', value: `${clan.totalMoney} CYEX`, inline: true }
                );
            const trans = await Clan.getRecentTransactions();
            if (trans.length > 0) {
                embed.addFields({ name: 'Últimas transacciones', value: trans.map(t => `${t.type === 'income' ? '➕' : '➖'} ${Math.abs(t.amount)} - ${t.description} (${t.username})`).join('\n') });
            }
            await interaction.reply({ embeds: [embed] });
        }
    }
}; 