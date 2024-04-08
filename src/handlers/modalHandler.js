const { readdirSync } = require('fs');
const path = require('path');

const modalsDir = path.join(__dirname, '../modals');

const handleModal = async (interaction) => {
    const modal = readdirSync(modalsDir).find((file) => file.slice(0, -3) === interaction.customId);
    if (modal) {
        const modalHandler = require(`${modalsDir}/${modal}`);
        await modalHandler.execute(interaction);
    }
};

module.exports = {
    handleModal
};