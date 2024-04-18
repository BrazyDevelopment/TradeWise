import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";

const execute = async (interaction: CommandInteraction) => {
    const modal = new ModalBuilder()
        .setCustomId('tokenSecurityModal')
        .setTitle('Check the security of a token with a CA.');

    const chainIdInput = new TextInputBuilder()
        .setCustomId('tokenSecurityChain')
        .setLabel('Enter The Chain ID or Name')
        .setPlaceholder(`e.g: 8453' or 'Base'`)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(10) 
        .setRequired(true);

    const contractAddressInput = new TextInputBuilder()
        .setCustomId('tokenSecurityContent')
        .setLabel('Contract Address')
        .setPlaceholder('e.g: 0x84011a7160e9C12573708Dd932e160f037Be33b8')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(chainIdInput);
    const secondActionRow = new ActionRowBuilder().addComponents(contractAddressInput);

    // @ts-expect-error im not sure
    modal.addComponents(firstActionRow, secondActionRow);
    
    await interaction.showModal(modal);
};

export default {
    data: new SlashCommandBuilder().setName("tokensecurity").setDescription("Check the security of a token."),
    execute
};