import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("chains")
    .setDescription("View networks and their ID(s)."),
  execute: async (interaction: CommandInteraction) => {
    const networks: {name: string, id: string}[] = [
      {
        "name": "Ethereum",
        "id": "1"
      },
      {
        "name": "BSC",
        "id": "56"
      },
      {
        "name": "Arbitrum",
        "id": "42161"
      },
      {
        "name": "Polygon",
        "id": "137"
      },
      {
        "name": "Solana",
        "id": "solana"
      },
      {
        "name": "opBNB",
        "id": "204"
      },
      {
        "name": "zkSync Era",
        "id": "324"
      },
      {
        "name": "Linea Mainnet",
        "id": "59144"
      },
      {
        "name": "Base",
        "id": "8453"
      },
      {
        "name": "Mantle",
        "id": "5000"
      },
      {
        "name": "Scroll",
        "id": "534352"
      },
      {
        "name": "Optimism",
        "id": "10"
      },
      {
        "name": "Avalanche",
        "id": "43114"
      },
      {
        "name": "Fantom",
        "id": "250"
      },
      {
        "name": "Cronos",
        "id": "25"
      },
      {
        "name": "HECO",
        "id": "128"
      },
      {
        "name": "Gnosis",
        "id": "100"
      },
      {
        "name": "Tron",
        "id": "tron"
      },
      {
        "name": "KCC",
        "id": "321"
      },
      {
        "name": "FON",
        "id": "201022"
      },
      {
        "name": "ZKFair",
        "id": "42766"
      },
      {
        "name": "Blast",
        "id": "81457"
      },
      {
        "name": "Manta Pacific",
        "id": "169"
      },
      {
        "name": "Berachain Artio Testnet",
        "id": "80085"
      },
      {
        "name": "Merlin",
        "id": "4200"
      }
    ];

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