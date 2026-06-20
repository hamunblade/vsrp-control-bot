const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {

        const channel = member.guild.systemChannel; // default welcome channel

        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTitle('👋 Welcome to Victoria State Roleplay!')
            .setDescription(`Welcome **${member.user.username}**!\n\nMake sure to read the rules and verify to get started.`)
            .setColor('#0A3D91')
            .setTimestamp();

        channel.send({ embeds: [embed] });
    }
};

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {

        // Assign Unverified role
        const role = member.guild.roles.cache.find(r => r.name === "Unverified");
        if (role) {
            await member.roles.add(role).catch(console.error);
        }

        // Optional welcome message
        const channel = member.guild.systemChannel;
        if (channel) {
            channel.send(`👋 Welcome **${member.user.username}**! You are now **Unverified**. Please verify to access the server.`);
        }

    }
};