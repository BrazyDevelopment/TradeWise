const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const execute = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId('tokenSecurityModal')
        .setTitle('Check the security of a token with a CA.');

    const chainIdInput = new TextInputBuilder()
        .setCustomId('tokenSecurityChain')
        .setLabel('Enter The Chain ID or Name')
        .setPlaceholder(`e.g: 8453' or 'Base'`)
        .setStyle(TextInputStyle.Short)
        .setMaxLength(10) //harmony network has 10 digits (highest i can think of)
        .setRequired(true);

    const contractAddressInput = new TextInputBuilder()
        .setCustomId('tokenSecurityContent')
        .setLabel('Contract Address')
        .setPlaceholder('e.g: 0x84011a7160e9C12573708Dd932e160f037Be33b8')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(chainIdInput);
    const secondActionRow = new ActionRowBuilder().addComponents(contractAddressInput);

    modal.addComponents(firstActionRow, secondActionRow);
    await interaction.showModal(modal);
};

module.exports = {
    name: 'tokensecurity',
    description: 'Check the security of a token',
    execute
};