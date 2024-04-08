const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder} = require('discord.js');
const fetch = require('isomorphic-fetch');
const emojis = require('../utils/emojis');
const chainNames = require ('../utils/chainNames');
const config = require ('../configs/config.json');

const execute = async (interaction) => {
    let chainIdOrName = interaction.fields.getTextInputValue('tokenSecurityChain');
    chainIdOrName = chainIdOrName.toLowerCase(); // Convert input to lowercase for case-insensitive comparison
    const contractAddress = interaction.fields.getTextInputValue('tokenSecurityContent');
    let chainId = null;

    // Check if the provided input matches a chain ID
    if (chainIdOrName in chainNames) {
        chainId = chainIdOrName;
    } else {
        // Check if the provided input matches a chain name
        for (const id in chainNames) {
            if (chainNames[id].toLowerCase() === chainIdOrName) {
                chainId = id;
                break;
            }
        }
    }

    if (!chainId) {
        await interaction.reply('Invalid chain ID or name.');
        return;
    }
    
    const chainNameToLowerCase = chainNames[chainId].toLowerCase();


    const options = {
        method: 'GET',
        headers: {
            accept: '*/*',
            // Authorization: `Bearer ${config.GOPLUS_API_KEY}`
        }
    };

    try {
        const response = await fetch(`https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${contractAddress}`, options);
        const tokenSecurityData = await response.json();
        const responseComment = tokenSecurityData.message;
        console.log("API Request returned code: " + responseComment);
        console.log(tokenSecurityData)

        if (tokenSecurityData.result === null) {
            await interaction.reply(responseComment);
            return;
        }
        const resultsData = Object.entries(tokenSecurityData.result)[0];


        const CA = resultsData[0]; // Contract address from api result (I could probably add user input validation from ${contractAddress})

        console.log(resultsData[1].dex)

        const embed = new EmbedBuilder()
        .setTitle(`Token Security for ${resultsData[1].token_name}`)
        .setDescription(`**On Chain ID:** \`${chainId}\`\n**Chain:** ${chainNames[chainId]}`)
        .setColor('Blurple')
        .addFields(
            { name: 'Contract Security For:', value: `\`${CA}\`` },
            { name: 'Open Source:', value: resultsData[1].is_open_source === '1' ? `Yes ${emojis.ok}` : `No ${emojis.warning}`, inline: true },
        );

        // Check if the contract is open source
        if (resultsData[1].is_open_source === '1') {
            // Add other contract security fields if open source
            embed.addFields(
                { name: 'Proxy Contract:', value: resultsData[1].is_proxy === '1' ? `Yes ${emojis.warning}` : `No ${emojis.ok}`, inline: true },
                { name: 'Mintable:', value: resultsData[1].is_mintable === '1' ? `Yes ${emojis.highrisk}` : `No ${emojis.ok}`, inline: true },
                { name: 'Honeypot:', value: resultsData[1].is_honeypot === '1' ? `Yes ${emojis.highrisk}` : `No ${emojis.ok}`, inline: true },
                { name: 'Renounced:', value: resultsData[1].can_take_back_ownership === '0' ? `Yes ${emojis.ok}` : `No ${emojis.highrisk}` || 'Unknown', inline: true },
                { name: 'Hidden Owner:', value: resultsData[1].hidden_owner === '1' ? `Yes ${emojis.highrisk}` : `No ${emojis.ok}` || 'Unknown', inline: true },
                // Add other contract security fields from https://docs.gopluslabs.io/reference/response-details
            );
        };

        console.log(resultsData[1])

        if (resultsData[1]) {
            // Add other contract security fields if open source
            embed.addFields(
                { name: '\u200B', value: '**Trading Security**' }, // Spacer between sections
                { name: 'Is in DEX:', value: resultsData[1].is_in_dex === '1' ? `Yes ${emojis.ok}` : `No ${emojis.highrisk}`, inline: true },
                { name: 'Blacklist:', value: resultsData[1].is_blacklisted === '1' ? `Yes ${emojis.highrisk}` : `No ${emojis.ok}` || 'Unknown', inline: true },
                { name: 'Trade Cooldown:', value: resultsData[1].trading_cooldown === '1' ? `Yes ${emojis.warning}` : `No ${emojis.ok}` || 'Unknown', inline: true },
                { name: 'Whitelist:', value: resultsData[1].is_whitelisted === '1' ? `Yes ${emojis.warning}` : `No ${emojis.ok}` || 'Unknown', inline: true },
                { name: 'Buy Tax:', value: resultsData[1].buy_tax === '0' || resultsData[1].buy_tax === '' ? `0% ${emojis.ok}` : `${resultsData[1].buy_tax}% ${emojis.warning}` || 'Unknown', inline: true},
                { name: 'Sell Tax:', value: resultsData[1].sell_tax === '0' || resultsData[1].sell_tax === '' ? `0% ${emojis.ok}` : `${resultsData[1].sell_tax}% ${emojis.warning}` || 'Unknown', inline: true},
                // Add other trading security fields from https://docs.gopluslabs.io/reference/response-details
                
                { name: '\u200B', value: '**Info Security**' }, // Spacer between sections
                { name: 'Token Name:', value: resultsData[1].token_name || 'Unknown', inline: true },
                { name: 'Token Symbol:', value: resultsData[1].token_symbol || 'Unknown', inline: true },
                { name: 'Token Holders:', value: resultsData[1].holder_count || 'Unknown', inline: true },
                { name: 'Total Supply:', value: resultsData[1].total_supply || 'Unknown', inline: true },
                { name: 'Creator Balance:', value: resultsData[1].creator_balance || 'Unknown', inline: true },
                { name: 'Creator %:', value: `${resultsData[1].creator_percent}%` || 'Unknown', inline: true },
            );
            // if (resultsData[1].is_in_dex === '1') {
            //     embed.addFields(
            //         { name: 'Liquidity:', value: `$${resultsData[1].dex[0].liquidity}` || 'Unknown', inline: false },
            //     )
            // }

                // Add other info security fields from https://docs.gopluslabs.io/reference/response-details
        };

        
        // If ETH or WETH based chain like Ethereum or Base
        const tradeWithSigma = new ButtonBuilder()
			.setLabel('Trade On Sigma')
            .setURL(`https://t.me/Sigma_buyBot?start=x${config.SIGMA_BOT_REFERRAL}-${contractAddress}`)
			.setStyle(ButtonStyle.Link);

        // View on DexScreener
		const viewOnDex = new ButtonBuilder()
			.setLabel('View Chart')
            .setURL(`https://dexscreener.com/${chainNameToLowerCase}/${contractAddress}`)
			.setStyle(ButtonStyle.Link);

		const row = new ActionRowBuilder()
			.addComponents(tradeWithSigma, viewOnDex);
        
        await interaction.reply({ embeds: [embed], components: [row] });
        
    } catch (error) {
        console.error(error);
        await interaction.reply('An error occurred while fetching the token security data.');
    }
};

module.exports = {
    customId: 'tokenSecurityModal',
    execute
};