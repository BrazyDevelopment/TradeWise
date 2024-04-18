import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import axios from "axios";
import networks, { translateNetwork } from "../../utils/networks";

export default {
  data: new SlashCommandBuilder()
    .setName("rugpull")
    .setDescription("Check if a contract has rug-pull risks (Beta).")
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
        `https://api.gopluslabs.io/api/v1/rugpull_detecting/${translated}?contract_addresses=${a}`
      )
      .then((d) => d.data)
      .catch(() =>
        interaction.reply({
          content: "Error looking up address",
          ephemeral: true,
        })
      );

    const fields: { name: string; value: string; inline: boolean }[] =
      new Array();

    if (response.result) {
      for (const [key, value] of Object.entries(response.result)) {

        console.log(key, value);

        const fieldValue = (value === 1) ? "✅ Yes" : "❌ No";

        if (key == "contract_name") continue;
        if (key == "owner") continue;

        fields.push({
          name: key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "),
          value: fieldValue,
          inline: true,
        });
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("Risk possession")
      .setDescription(
        `**Network**: ${
          networks.find((net) => net.id == translated)?.name
        } (${translated})`
      )
      .addFields({ name: "CA", value: `\`${a}\``, inline: false }, ...fields)
      .setColor("Blurple");
    return interaction.reply({ embeds: [embed] });
  },
};
