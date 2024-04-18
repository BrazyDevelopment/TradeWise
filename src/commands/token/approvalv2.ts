import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import axios from "axios";
import networks, { translateNetwork } from "../../utils/networks";

export default {
  data: new SlashCommandBuilder()
    .setName("approvalsecurityv2")
    .setDescription(
      "Returns the ERC-20 approvals of an EOA address and associated risk items."
    )
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
        `https://api.gopluslabs.io/api/v2/token_approval_security/${translated}?addresses=${a}`
      )
      .then((d) => d.data)
      .catch(() =>
        interaction.reply({
          content: "Error looking up address",
          ephemeral: true,
        })
      );

    const response2 = await axios
      .get(
        `https://api.gopluslabs.io/api/v2/nft721_approval_security/${translated}?addresses=${a}`
      )
      .then((d) => d.data)
      .catch(() =>
        interaction.reply({
          content: "Error looking up address",
          ephemeral: true,
        })
      );

    const response3 = await axios
      .get(
        `https://api.gopluslabs.io/api/v2/nft1155_approval_security/${translated}?addresses=${a}`
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
      //console.log(response)

      for (const [key, value] of Object.entries(response.result)) {
        const fieldValue = value === "1" || 1 ? "✅ Yes" : "❌ No";

        fields.push({
          name: key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "),
          value: fieldValue,
          inline: true,
        });
      }

      if (
        response.result &&
        response.result.risky_approval &&
        response.result.risky_approval.risk
      ) {
        fields.push({
          name: "Risk",
          value: `${response.result.risky_approval.risk}`,
          inline: false,
        });
      }
      if (response2.result) {
        //console.log(response);
        const fields: { name: string; value: string; inline: boolean }[] =
          new Array();

        for (const [key, value] of Object.entries(response2.result)) {
          const fieldValue = value === "1" || 1 ? "✅ Yes" : "❌ No";

          fields.push({
            name:
              key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "),
            value: fieldValue,
            inline: true,
          });
        }
      }
      if (response3.result) {
        //console.log(response);
        const fields: { name: string; value: string; inline: boolean }[] =
          new Array();

        for (const [key, value] of Object.entries(response3.result)) {
          const fieldValue = value === "1" || 1 ? "✅ Yes" : "❌ No";

          fields.push({
            name:
              key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "),
            value: fieldValue,
            inline: true,
          });
        }
      }

      const embed = new EmbedBuilder()
        .setTitle("Contract Approval Security")
        .setDescription(
          `**Network**: ${
            networks.find((net) => net.id == translated)?.name
          } (${translated})`
        )
        .addFields({ name: "CA", value: `\`${a}\``, inline: false }, ...fields)
        .setColor("Blurple");
      return interaction.reply({ embeds: [embed] });
    } else {
      return interaction.reply({
        content: "Error looking up address",
        ephemeral: true,
      });
    }
  },
};
