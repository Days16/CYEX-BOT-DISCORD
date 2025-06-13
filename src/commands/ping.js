const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia del bot y verifica su funcionamiento'),

    async execute(interaction) {
        const sent = await interaction.reply({ content: '🏓 Calculando ping...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setTitle('✅ Bot Funcionando')
            .setColor('#00ff00')
            .addFields(
                { name: '🤖 Latencia del Bot', value: `${latency}ms`, inline: true },
                { name: '🌐 Latencia de la API', value: `${apiLatency}ms`, inline: true }
            )
            .setFooter({ text: 'CYEX BOT' })
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
    },
}; 