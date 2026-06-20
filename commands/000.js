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

        // On-duty roles
        const dutyRoles = {
            police: "On Duty - Victorian Police Force",
            fire: "On Duty - Fire Rescue Victoria",
            ambulance: "On Duty - Paramedics Victoria",
            vicroads: "On Duty - VicRoads"
        };

        // Radio channels
        const radioChannels = {
            police: "🚓victorian-police-force-radio",
            fire: "🚒fire-rescue-victoria-radio",
            ambulance: "🚑paramedics-victoria-radio",
            vicroads: "🚕vicroads-radio"
        };

        const roleName = dutyRoles[service];
        const radioName = radioChannels[service];

        const role = interaction.guild.roles.cache.find(r => r.name === roleName);
        const radioChannel = interaction.guild.channels.cache.find(c => c.name === radioName);

        if (!role) {
            return interaction.reply({
                content: `On-duty role **${roleName}** not found.`,
                ephemeral: true
            });
        }

        if (!radioChannel) {
            return interaction.reply({
                content: `Radio channel **${radioName}** not found.`,
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

        // Send to caller's channel
        await interaction.reply({
            content: `${role}`,
            embeds: [embed]
        });

        // Send to radio channel
        await radioChannel.send({
            content: `${role} — New 000 call received`,
            embeds: [embed]
        });
    }
};