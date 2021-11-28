import { Client, Intents } from 'discord.js';
import { HoggoCommandManager } from './commands/hoggo-command.manager';
import { token, clientId, guildId } from './config.json';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const commandManager = new HoggoCommandManager(token, clientId, guildId);
commandManager.initialize();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commandManager.getCommand(interaction.commandName);

    if (!command) {
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);

        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});

client.login(token);