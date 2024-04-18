import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import networks, { translateNetwork } from "../../utils/networks";

export default {
  data: new SlashCommandBuilder()
    .setName("checkmalicious")
    .setDescription("Check if am address is marked malicious.")
    .addStringOption((opt) =>
      opt
        .setName("address")
        .setDescription("Address to lookup for.")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("chain")
        .setDescription("Chain ID. use /chains for more info")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {
    const a = interaction.options.get("address")?.value?.toString();
    const chain = interaction.options.get("chain")?.value?.toString();

    const translated = translateNetwork(chain as string);

    if (!translated) {
      return interaction.reply({
        content:
          "Invalid network provided!, use </chains:1230505456342925354> to view available chains.",
        ephemeral: true,
      });
    }

    const response = await axios
      .get(
        `https://api.gopluslabs.io/api/v1/address_security/${a}?chain_id=${translated}`
      )
      .then((d) => d.data)
      .catch(() =>
        interaction.reply({
          content: "Error looking up address",
          ephemeral: true,
        })
      );

    if (response.result) {
      const fields: {name: string, value: string, inline: boolean}[] = new Array();

      for (const [key, value] of Object.entries(response.result)) {
        const fieldValue = value === "1" ? "✅" : "❌";
        
        fields.push({ name: key, value: fieldValue, inline: true });
      }

      const embed = new EmbedBuilder().setTitle("Malicious Address Lookup").setDescription(`**Network**: ${networks.find(net => net.id == translated)?.name} (${translated})`).addFields({ name: "Address", value: `\`${a}\``, inline: false }, ...fields).setColor("Blurple");
      return interaction.reply({ embeds: [embed]});
    } else {
      return interaction.reply({
        content: "Error looking up address",
        ephemeral: true,
      });
    }
  },
};
