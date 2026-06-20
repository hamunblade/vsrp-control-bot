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

        // Map service → your exact role names
        const serviceRoles = {
            police: "Victorian Police Force",
            fire: "Fire Rescue Victoria",
            ambulance: "Paramedics Victoria",
            vicroads: "VicRoads"
        };

        const roleName = serviceRoles[service];
        const role = interaction.guild.roles.cache.find(r => r.name === roleName);

        if (!role) {
            return interaction.reply({
                content: `Role **${roleName}** not found. Please create it.`,
                ephemeral: true
            });
        }

        // Emergency embed
        const embed = new EmbedBuilder()
            .setTitle('🚨 000 EMERGENCY REQUEST')
            .setColor('#ff0000')
            .addFields(
                { name: 'Caller', value: `${interaction.user}` },
                { name: 'Service Requested', value: roleName },
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