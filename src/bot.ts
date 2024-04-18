import { Client, Events, GatewayIntentBits, ActivityType, Collection } from "discord.js";
import path from "path";
import fs from "fs";

import modalHandler from "./handlers/modalHandler";
import DeployCommands from "./deploy";

interface SlashBot extends Client {
    commands: Collection<string, any>
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
}) as SlashBot;

client.commands = new Collection();

client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    client.user?.setPresence({
        activities: [{ name: 'Every Launch. Ever.', type: ActivityType.Watching }],
        status: 'dnd'
    });
    console.log(client.user?.id);

    // we only have to call this every time a new command is made.
    // comment this out after deploying
    //await DeployCommands(client.user?.id);
});

loadCommands().then(() => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else if (interaction.isModalSubmit()) {
            await modalHandler.handleModal(interaction);
        }
    });
});

async function loadCommands() {
    const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
    await Promise.all(commandFolders.map(async (folder) => {
        const commandsPath = path.join(path.join(__dirname, 'commands'), folder);
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
        await Promise.all(commandFiles.map(async (file) => {
            const filePath = path.join(commandsPath, file);
            const command = (await import(filePath)).default;
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }));
    }));
}

client.login(Bun.env.DISCORD_BOT_TOKEN);