const { readdirSync } = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, '../commands');

const registerCommands = async (client) => {
    const commands = [];

    readdirSync(commandsDir).forEach((file) => {
        if (file.endsWith('.js')) {
            const command = require(`${commandsDir}/${file.slice(0, -3)}`);
            commands.push(command);
        }
    });

    // Only For Testing set commands to guild only due to the fact discord takes >1hr to cache commands to your app
    // const currentGuild = client.guilds.cache.get('1046888638715273286');
    // await currentGuild.commands.set(commands);

    // Uncomment for live
    await client.application.commands.set(commands);
};

const handleCommand = async (interaction) => {
    const command = require(`${commandsDir}/${interaction.commandName}`);
    await command.execute(interaction);
};

module.exports = {
    registerCommands,
    handleCommand
};