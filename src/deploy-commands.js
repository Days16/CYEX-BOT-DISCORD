const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[ADVERTENCIA] El comando en ${filePath} no tiene las propiedades "data" o "execute" requeridas.`);
    }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Comenzando a actualizar ${commands.length} comandos (/) de la aplicación.`);

        let data;
        if (process.env.GUILD_ID) {
            // Comandos para un servidor específico
            data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands },
            );
            console.log(`Comandos (/) actualizados para el servidor ${process.env.GUILD_ID}.`);
        } else {
            // Comandos globales
            data = await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands },
            );
            console.log('Comandos (/) actualizados globalmente.');
        }

        console.log(`Se han actualizado ${data.length} comandos (/) de la aplicación.`);
    } catch (error) {
        console.error(error);
    }
})(); 