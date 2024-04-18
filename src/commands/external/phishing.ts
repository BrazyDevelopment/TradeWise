import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import axios from "axios";

export default {
  data: new SlashCommandBuilder()
    .setName("phishing")
    .setDescription("See if a website is a phishing link.")
    .addStringOption((opt) =>
      opt.setName("link").setDescription("Website to lookup.").setRequired(true)
    ),
  execute: async (interaction: CommandInteraction) => {
    const link = interaction.options.get("link")?.value?.toString();

    const response = await axios
      .get(`https://api.gopluslabs.io/api/v1/phishing_site/?url=${link}`)
      .then((d) => d.data)
      .catch(() =>
        interaction.reply({
          content: "Error looking up website",
          ephemeral: true,
        })
      );

    const embed = new EmbedBuilder()
      .setTitle("Phishing Detector")
      .setDescription(`${(response.result.phishing_site == 1) ? "⚠️ :no_entry: This website is a **Phishing Site**, please refrain from using it!!" : "Passed test, we have no guarantee the site is still safe tho."}`)
      .setColor((response.result.phishing_site == 1) ? "Red" : "Blurple");
    return interaction.reply({ embeds: [embed] });
  },
};
