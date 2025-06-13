const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const User = require('../models/User');
const Jimp = require('jimp');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('card')
        .setDescription('Gestiona tu tarjeta de identificación')
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Crear o actualizar tu tarjeta de identificación')
                .addStringOption(option =>
                    option.setName('nickname')
                        .setDescription('Tu apodo en el clan')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('role')
                        .setDescription('Tu rol en el clan')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('join_date')
                        .setDescription('Fecha de ingreso al clan (DD/MM/YYYY)')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('Ver tu tarjeta de identificación')),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'create': {
                const nickname = interaction.options.getString('nickname');
                const role = interaction.options.getString('role');
                const joinDate = interaction.options.getString('join_date');

                await User.updateCard(interaction.user.id, {
                    nickname,
                    role,
                    joinDate,
                    discordId: interaction.user.id,
                    username: interaction.user.username
                });

                await interaction.reply({
                    content: '✅ Tu tarjeta de identificación ha sido actualizada',
                    ephemeral: true
                });
                break;
            }

            case 'view': {
                const user = await User.getUser(interaction.user.id);
                
                if (!user || !user.card) {
                    return interaction.reply({
                        content: '❌ No tienes una tarjeta de identificación. Usa `/card create` para crear una.',
                        ephemeral: true
                    });
                }

                // Crear la imagen de la tarjeta
                const card = new Jimp(800, 400, '#2C2F33');
                const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
                const titleFont = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);

                // Cargar y redimensionar el avatar
                const avatar = await Jimp.read(interaction.user.displayAvatarURL({ extension: 'png', size: 256 }));
                avatar.resize(200, 200);
                avatar.circle();

                // Añadir el avatar a la tarjeta
                card.composite(avatar, 50, 100);

                // Añadir el texto
                card.print(titleFont, 300, 50, user.card.nickname);
                card.print(font, 300, 150, `Rol: ${user.card.role}`);
                card.print(font, 300, 200, `Miembro desde: ${user.card.joinDate}`);
                card.print(font, 300, 250, `Discord: ${user.card.username}`);

                // Añadir borde
                card.scan(0, 0, card.bitmap.width, card.bitmap.height, function(x, y, idx) {
                    if (x < 5 || x > card.bitmap.width - 5 || y < 5 || y > card.bitmap.height - 5) {
                        this.bitmap.data[idx] = 0x72; // R
                        this.bitmap.data[idx + 1] = 0x89; // G
                        this.bitmap.data[idx + 2] = 0xDA; // B
                    }
                });

                // Convertir a buffer y enviar
                const buffer = await card.getBufferAsync(Jimp.MIME_PNG);
                const attachment = new AttachmentBuilder(buffer, { name: 'card.png' });
                await interaction.reply({ files: [attachment] });
                break;
            }
        }
    },
}; 