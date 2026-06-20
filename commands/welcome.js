const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Sends a welcome message to a user.')
        .addUserOption(option =>
            option
                .setName('member')
                .setDescription('The member to welcome')
                .setRequired(true)
        ),

    async execute(interaction) {
        const member = interaction.options.getUser('member');

        const embed = new EmbedBuilder()
            .setTitle('👋 Welcome to the server!')
            .setDescription(`We’re glad to have you here, **${member.username}**!`)
            .setColor('#0A3D91') // your police‑blue aesthetic
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};