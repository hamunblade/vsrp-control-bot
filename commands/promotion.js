const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('promotion')
        .setDescription('Promote a member to a new rank.')
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The member to promote')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('newrank')
                .setDescription('The new rank to assign')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const newRank = interaction.options.getRole('newrank');

        if (!member) return interaction.reply({ content: 'Member not found.', ephemeral: true });

        // Remove all rank roles (optional — you can customize this)
        const rankRoles = member.roles.cache.filter(r => r.name.includes("Rank"));
        for (const role of rankRoles.values()) {
            await member.roles.remove(role).catch(() => {});
        }

        // Add the new rank
        await member.roles.add(newRank).catch(() => {
            return interaction.reply({ content: 'I cannot assign that role.', ephemeral: true });
        });

        // Embed response
        const embed = new EmbedBuilder()
            .setTitle('Promotion Successful')
            .setColor('#0A3D91')
            .setDescription(`${member} has been promoted to **${newRank.name}**`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};