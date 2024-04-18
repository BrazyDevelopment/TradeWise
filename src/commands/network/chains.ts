import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import networks from "../../utils/networks";

export default {
  data: new SlashCommandBuilder()
    .setName("chains")
    .setDescription("View networks and their ID(s)."),
  execute: async (interaction: CommandInteraction) => {

    const embed = new EmbedBuilder()
      .setTitle("Available Networks")
      .setDescription("These are the blockchains that are available to query.")
      .setColor("Blurple");
    const fieldArray: {name: string, value: string, inline: boolean}[] = new Array();

    for (const network in networks) {
        fieldArray.push({name: networks[network].name, value: `ID: ${networks[network].id}`, inline: true});
    }

    embed.addFields(fieldArray);

    await interaction.reply({ embeds: [embed] });
  },
};