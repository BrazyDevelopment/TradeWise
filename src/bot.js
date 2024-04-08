const config = require('./configs/config.json' );
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const commandHandler = require('./handlers/commandHandler');
const modalHandler = require('./handlers/modalHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
});

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'Every Launch. Ever.', type: ActivityType.Watching }],
        status: 'dnd'
    });
    await commandHandler.registerCommands(client);
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await commandHandler.handleCommand(interaction);
    } else if (interaction.isModalSubmit()) {
        await modalHandler.handleModal(interaction);
    }
});

// client.login(process.env.DISCORD_BOT_TOKEN);

client.login(config.DISCORD_BOT_TOKEN);