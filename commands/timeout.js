const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user for a set duration.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to timeout')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Duration (e.g., 10m, 1h, 1d)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for timeout')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) {
            return interaction.reply({
                content: '❌ User not found in the server.',
                ephemeral: true
            });
        }

        // Convert duration text → milliseconds
        const timeMap = {
            s: 1000,
            m: 60000,
            h: 3600000,
            d: 86400000
        };

        const unit = duration.slice(-1);
        const value = parseInt(duration.slice(0, -1));

        if (!timeMap[unit] || isNaN(value)) {
            return interaction.reply({
                content: '❌ Invalid duration. Use formats like `10m`, `1h`, `1d`.',
                ephemeral: true
            });
        }

        const ms = value * timeMap[unit];

        await member.timeout(ms, reason);

        await interaction.reply({
            content: `⏳ **${user.tag}** has been timed out for **${duration}**.\n📄 Reason: ${reason}`
        });
    }
};