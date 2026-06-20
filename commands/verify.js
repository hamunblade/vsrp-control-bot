const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify yourself to access the server'),

    async execute(interaction) {

        const unverified = interaction.guild.roles.cache.find(r => r.name === "Unverified");
        const verified = interaction.guild.roles.cache.find(r => r.name === "Verified");

        // Remove Unverified
        if (unverified && interaction.member.roles.cache.has(unverified.id)) {
            await interaction.member.roles.remove(unverified);
        }

        // Add Verified
        if (verified) {
            await interaction.member.roles.add(verified);
        }

        await interaction.reply({
            content: `✅ You are now verified, ${interaction.user.username}!`,
            ephemeral: true
        });
    }
};