import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import axios from "axios";
import networks, { translateNetwork } from "../../utils/networks";

export default {
  data: new SlashCommandBuilder()
    .setName("decodeabi")
    .setDescription("Check if the approval is secure.")
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
    )
    .addStringOption((opt) =>
      opt
        .setName("data")
        .setDescription("Transaction input (Signature).")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("signer").setDescription("Signer address.").setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("txtype")
        .setDescription("Type of transaction.")
        .addChoices(
          { name: "Common", value: "common" },
          { name: "Sign Typed (v4)", value: "eth_signTypedData_v4" },
          { name: "Personal Sign", value: "personal_sign" },
          { name: "ETH Sign", value: "eth_sign" }
        )
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {
    try {
      const a = interaction.options.get("address")?.value?.toString();
      const chain = interaction.options.get("chain")?.value?.toString();
      const data = interaction.options.get("data")?.value?.toString();
      const signer = interaction.options.get("signer")?.value?.toString();
      const transaction_type = interaction.options
        .get("txtype")
        ?.value?.toString();

      const translated = translateNetwork(chain as string);

      if (!translated) {
        return interaction.reply({
          content:
            "Invalid network provided!, use </chains:1230505456342925354> to view available chains.",
          ephemeral: true,
        });
      }

      const response = await axios
        .post(`https://api.gopluslabs.io/api/v1/abi/input_decode/`, {
          chain_id: translated,
          contract_address: a,
          data,
          signer,
          transaction_type,
        })
        .then((d) => d.data)
        .catch(() =>
          interaction.reply({
            content: "Error looking up address",
            ephemeral: true,
          })
        );

      if (response.result) {
        //console.log(response);
        const fields: { name: string; value: string; inline: boolean }[] =
          new Array();

        fields.push({
          name: "Risk",
          value: response.result.risk ? "✅ Yes" : "❌ No",
          inline: true,
        });
        fields.push({
          name: "Malicious Contract",
          value: response.result.malicious_contract ? "✅ Yes" : "❌ No",
          inline: true,
        });
        fields.push({
          name: "Risky Signature",
          value: response.result.risky_signature ? "✅ Yes" : "❌ No",
          inline: true,
        });

        if (response.result.contract_name) {
          fields.push({
            name: "Contract Name",
            value: `**${response.result.contract_name}**`,
            inline: false,
          });
        }

        if (response.result.contract_description) {
          fields.push({
            name: "Contract Description",
            value: response.result.contract_description,
            inline: true,
          });
        }

        if (response.result && response.result.risk) {
          fields.push({
            name: "Risk",
            value: `${response.result.risk}`,
            inline: false,
          });
        }

        const embed = new EmbedBuilder()
          .setTitle("Contract Approval Security")
          .setDescription(
            `**Network**: ${
              networks.find((net) => net.id == translated)?.name
            } (${translated})`
          )
          .addFields(
            { name: "CA", value: `\`${a}\``, inline: false },
            ...fields
          )
          .setColor("Blurple");
        return interaction.reply({ embeds: [embed] });
      } else {
        return interaction.reply({
          content: "Error looking up address",
          ephemeral: true,
        });
      }
    } catch (e) {
      console.error(e);
      return interaction.reply({ content: "Error", ephemeral: true });
    }
  },
};
