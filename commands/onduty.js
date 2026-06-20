const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('onduty')
        .setDescription('Go on duty for your department.')
        .addStringOption(option =>
            option.setName('department')
                .setDescription('Select your department')
                .setRequired(true)
                .addChoices(
                    { name: 'Victorian Police Force', value: 'police' },
                    { name: 'Fire Rescue Victoria', value: 'fire' },
                    { name: 'Paramedics Victoria', value: 'ambulance' },
                    { name: 'VicRoads', value: 'vicroads' }
                )
        ),

    async execute(interaction) {
        const department = interaction.options.getString('department');

        const dutyRoles = {
            police: "On Duty - Victorian Police Force",
            fire: "On Duty - Fire Rescue Victoria",
            ambulance: "On Duty - Paramedics Victoria",
            vicroads: "On Duty - VicRoads"
        };

        const offDutyRoles = {
            police: "Off Duty - Victorian Police Force",
            fire: "Off Duty - Fire Rescue Victoria",
            ambulance: "Off Duty - Paramedics Victoria",
            vicroads: "Off Duty - VicRoads"
        };

        const onRole = interaction.guild.roles.cache.find(r => r.name === dutyRoles[department]);
        const offRole = interaction.guild.roles.cache.find(r => r.name === offDutyRoles[department]);

        if (!onRole || !offRole) {
            return interaction.reply({
                content: "One or more duty roles are missing.",
                ephemeral: true
            });
        }

        // Remove off-duty role, add on-duty role
        await interaction.member.roles.remove(offRole).catch(() => {});
        await interaction.member.roles.add(onRole);

        const embed = new EmbedBuilder()
            .setTitle('🟢 You are now ON DUTY')
            .setColor('#00ff00')
            .setDescription(`You are now marked **On Duty** for **${onRole.name.replace("On Duty - ", "")}**.`)
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};