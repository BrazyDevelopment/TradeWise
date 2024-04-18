import type { ModalSubmitInteraction } from 'discord.js';
import { readdirSync } from 'fs';
import path from 'path';

const modalsDir: string = path.join(__dirname, '../modals');

const handleModal = async (interaction: ModalSubmitInteraction): Promise<void> => {
    const modal: string | undefined = readdirSync(modalsDir).find((file: string) => file.slice(0, -3) === interaction.customId);
    if (modal) {
        const modalHandler = await import(`${modalsDir}/${modal}`);
        console.log(modalHandler.default);
        await modalHandler.default.execute(interaction);
    }
};

export default {
    handleModal
};