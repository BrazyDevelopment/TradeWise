import {
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
  } from "discord.js";
  import axios from "axios";
  import networks, { translateNetwork } from "../../utils/networks";
  
  export default {
    data: new SlashCommandBuilder()
      .setName("nftsecurity")
      .setDescription("Get NFT's security and risk data.")
      .addStringOption((opt) =>
        opt
          .setName("chain")
          .setDescription("Chain ID. use /chains for more info")
          .setRequired(true)
      ).addStringOption((opt) =>
        opt
          .setName("address")
          .setDescription("Contract address of the NFT.")
          .setRequired(true)
      ).addStringOption((opt) =>
        opt
          .setName("token_id")
          .setDescription("Token ID of the NFT.")
          .setRequired(true)
      ),
    execute: async (interaction: CommandInteraction) => {
      const a = interaction.options.get("address")?.value?.toString();
      const chain = interaction.options.get("chain")?.value?.toString();
      const token_id = interaction.options.get("token_id")?.value?.toString();
  
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
          `https://api.gopluslabs.io/api/v1/nft_security/${translated}?contract_addresses=${a}&token_id=${token_id}`
        )
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
  
        console.log(response);

        fields.push({ name: 'Flagged NFT', value: response.result.red_check_mark ? "✅ Yes": "❌ No", inline: true});
        fields.push({ name: 'Frozen Metadata', value: response.result.metadata_frozen ? "✅ Yes": "❌ No", inline: true});
        fields.push({ name: 'Oversupply Minting', value: response.result.oversupply_minting ? "✅ Yes": "❌ No", inline: true});
        fields.push({ name: 'Token Verified', value: response.result.nft_verified ? "✅ Yes": "❌ No", inline: true});
        fields.push({ name: 'Open Source', value: (response.result.open_source == 1) ? "✅ Yes": "❌ No", inline: true});
        fields.push({ name: 'Malicious Contract', value: (response.result.malicious_nft_contract== 1) ? "✅ Yes": "❌ No", inline: true});
        
  
        const embed = new EmbedBuilder()
          .setTitle("NFT Security")
          .setDescription(
            `**Network**: ${
              networks.find((net) => net.id == translated)?.name
            } (${translated})`
          )
          .addFields({ name: "CA", value: `\`${a}\``, inline: false }, { name: "Token ID", value: `\`${token_id}\``, inline: true}, { name: "Total Supply", value: `\`${response.result.nft_items}\``, inline: true}, { name: "**Description**", value: `${response.result.nft_description || "Not provided."}`, inline: false}, {"name": "Creator Address", value: `\`${response.result.creator_address}\``}, ...fields)
          .setColor("Blurple");
        return interaction.reply({ embeds: [embed] });
      } else {
        return interaction.reply({
          content: "Error looking up NFT",
          ephemeral: true,
        });
      }
    },
  };
  