import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';

export default async function DeployCommands(clientId: string | undefined): Promise<void> {
    const { DISCORD_BOT_TOKEN: token } = Bun.env;

    if (!token || !clientId) {
        console.error("Missing required environment variables!");
        process.exit(1);
    }

    const commands = new Array();

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    try {
        await Promise.all(commandFolders.map(async (folder) => {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = (await import(filePath)).default;
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }));
    } catch (e) {
        console.error(e);
    } finally {
        const rest = new REST({ version: '9' }).setToken(token);

        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commands },
            );

            console.log(`Successfully reloaded ${(data as any).length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    }
}