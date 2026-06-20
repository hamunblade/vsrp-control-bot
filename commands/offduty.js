const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('offduty')
        .setDescription('Go off duty for your department.'),

    async execute(interaction) {

        const onDutyRoles = [
            "On Duty - Victorian Police Force",
            "On Duty - Fire Rescue Victoria",
            "On Duty - Paramedics Victoria",
            "On Duty - VicRoads"
        ];

        const offDutyRoles = [
            "Off Duty - Victorian Police Force",
            "Off Duty - Fire Rescue Victoria",
            "Off Duty - Paramedics Victoria",
            "Off Duty - VicRoads"
        ];

        let changed = false;

        for (let i = 0; i < onDutyRoles.length; i++) {
            const onRole = interaction.guild.roles.cache.find(r => r.name === onDutyRoles[i]);
            const offRole = interaction.guild.roles.cache.find(r => r.name === offDutyRoles[i]);

            if (onRole && interaction.member.roles.cache.has(onRole.id)) {
                await interaction.member.roles.remove(onRole);
                if (offRole) await interaction.member.roles.add(offRole);
                changed = true;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('🔴 You are now OFF DUTY')
            .setColor('#ff0000')
            .setDescription(changed
                ? 'You have been marked **Off Duty**.'
                : 'You were not on duty.')
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};