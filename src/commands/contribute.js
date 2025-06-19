const { SlashCommandBuilder } = require('discord.js');
const Clan = require('../models/Clan');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('contribute')
        .setDescription('Registra una contribución personal al clan')
        .addNumberOption(opt => opt.setName('cantidad').setDescription('Cantidad a contribuir').setRequired(true))
        .addStringOption(opt => opt.setName('descripcion').setDescription('Descripción').setRequired(true)),

    async execute(interaction) {
        const cantidad = interaction.options.getNumber('cantidad');
        const descripcion = interaction.options.getString('descripcion');
        await Clan.addContribution(cantidad, descripcion, interaction.user.id, interaction.user.username);
        await User.addContribution(interaction.user.id, interaction.user.username, cantidad, descripcion);
        await interaction.reply({ content: `✅ Has contribuido ${cantidad} CYEX al clan. ¡Gracias!`, ephemeral: true });
    }
}; 