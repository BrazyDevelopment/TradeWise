import {
  AttachmentBuilder,
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
    try {
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

    const fields = [...response.result, ...response2.result, ...response3.result];
    const jsonFile = new AttachmentBuilder(Buffer.from(JSON.stringify(fields)), {
      name: 'approvalHistory.json'
    });

    return interaction.reply({ content: "Content might be too big to display on embed, please check the file attached below.\nAs a reference, \"0\" in the JSON means `false` and \"1\" means `true`:", files: [jsonFile] });
  } catch (e) {
    return interaction.reply({ content: "Unknown error", ephemeral: true });
  }
  },
};
