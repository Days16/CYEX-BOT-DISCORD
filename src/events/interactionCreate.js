const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No se encontró el comando ${interaction.commandName}.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
            } else {
                await interaction.reply({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
            }
        }
    },
}; 