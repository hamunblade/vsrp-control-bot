const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Remove timeout from a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to remove timeout from')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for removing the timeout')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: '❌ User not found in the server.',
                ephemeral: true
            });
        }

        if (!member.isCommunicationDisabled()) {
            return interaction.reply({
                content: `❌ **${user.tag}** is not currently timed out.`,
                ephemeral: true
            });
        }

        await member.timeout(null, reason);

        await interaction.reply({
            content: `🔓 **${user.tag}** has been un‑timed‑out.\n📄 Reason: ${reason}`
        });
    }
};