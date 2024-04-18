import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import axios from "axios";

export default {
  data: new SlashCommandBuilder()
    .setName("dapp")
    .setDescription("Check the security of a dapp (website).")
    .addStringOption((opt) =>
      opt.setName("link").setDescription("Website to lookup.").setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {
    const link = interaction.options.get("link")?.value?.toString();

    const response = await axios
      .get(`https://api.gopluslabs.io/api/v1/dapp_security/?url=${link}`)
      .then((d) => d.data)
      .catch(() =>
        interaction.reply({
          content: "Error looking up website",
          ephemeral: true,
        })
      );

    const fields: { name: string; value: string; inline?: boolean }[] =
      new Array();

    if (response.result) {
      fields.push({
        name: "Is Audited",
        value: response.result.is_audit == 1 ? "✅ Yes" : "❌ No",
        inline: true,
      });
      fields.push({
        name: "Trust List",
        value: response.result.trust_list == 1 ? "✅ Yes" : "❌ No",
        inline: true,
      });

      if (response.result.contracts_security[0]?.contracts) {
        console.log(
          response.result.contracts_security[0].contracts[0].is_open_source
        );
        fields.push({
          name: "Open Source",
          value:
            response.result.contracts_security[0].contracts[0].is_open_source ==
            1
              ? "✅ Yes"
              : "❌ No",
          inline: true,
        });
        fields.push({
          name: "Malicious Creator",
          value:
            response.result.contracts_security[0].contracts[0]
              .malicious_creator == 1
              ? "✅ Yes"
              : "❌ No",
          inline: true,
        });
        fields.push({
          name: "Malicious Contract",
          value:
            response.result.contracts_security[0].contracts[0]
              .malicious_contract == 1
              ? "✅ Yes"
              : "❌ No",
          inline: true,
        });
        fields.push({
          name: "Contract Address",
          value: `\`${response.result.contracts_security[0].contracts[0].contract_address}\``,
          inline: false,
        });
        fields.push({
          name: "Creator Address",
          value: `\`${response.result.contracts_security[0].contracts[0].creator_address}\``,
          inline: false,
        });
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("Dapp Lookup")
      .setDescription(
        `${
          response.message && response.message == "DAPP not found!"
            ? "That doesn't look like a Dapp!"
            : `${response.result.project_name} was lasted audited at ${response.result.audit_info[0].audit_time} by [${response.result.audit_info[0].audit_firm}](${response.result.audit_info[0].audit_link})`
        }`
      )
      .addFields([...fields])
      .setColor("Blurple");
    return interaction.reply({ embeds: [embed] });
  },
};
