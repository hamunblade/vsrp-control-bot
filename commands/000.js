const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('000')
        .setDescription('Request immediate emergency assistance.')
        .addStringOption(option =>
            option.setName('service')
                .setDescription('Which emergency service do you need?')
                .setRequired(true)
                .addChoices(
                    { name: 'Police', value: 'police' },
                    { name: 'Fire', value: 'fire' },
                    { name: 'Ambulance', value: 'ambulance' },
                    { name: 'VicRoads', value: 'vicroads' }
                )
        )
        .addStringOption(option =>
            option.setName('details')
                .setDescription('Describe the emergency.')
                .setRequired(true)
        ),

    async execute(interaction) {

        const service = interaction.options.getString('service');
        const details = interaction.options.getString('details');

        // EXACT on-duty role names
        const dutyRoles = {
            police: "On Duty - Victorian Police Force",
            fire: "On Duty - Fire Rescue Victoria",
            ambulance: "On Duty - Paramedics Victoria",
            vicroads: "On Duty - VicRoads"
        };

        const roleName = dutyRoles[service];
        const role = interaction.guild.roles.cache.find(r => r.name === roleName);

        if (!role) {
            return interaction.reply({
                content: `On-duty role **${roleName}** not found. Please create it.`,
                ephemeral: true
            });
        }

        // Emergency embed
        const embed = new EmbedBuilder()
            .setTitle('🚨 000 EMERGENCY REQUEST')
            .setColor('#ff0000')
            .addFields(
                { name: 'Caller', value: `${interaction.user}` },
                { name: 'Service Requested', value: roleName.replace("On Duty - ", "") },
                { name: 'Location', value: `${interaction.channel}` },
                { name: 'Details', value: details }
            )
            .setTimestamp();

        await interaction.reply({
            content: `${role}`,
            embeds: [embed]
        });
    }
};