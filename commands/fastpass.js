const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fastpass')
        .setDescription('Grants a staff fastpass to a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to give fastpass to')
                .setRequired(true)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        await interaction.reply({
            content: `💨 Fastpass granted to **${user.username}**.`,
            ephemeral: true
        });
    }
};