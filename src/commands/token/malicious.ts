import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("checkmalicious")
    .setDescription("Check if a token is marked malicious.")
    .addStringOption((opt) =>
      opt
        .setName("address")
        .setDescription("Contract address to lookup for.")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("chain")
        .setDescription("Chain ID. use /chains for more info")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {},
};
