import { Client, Intents } from 'discord.js';
import { CommandManagerService } from './common/commands/command-manager.service';
import { token, clientId, guildId } from './config.json';
import { PartyModule } from './modules/party/party.module';
import { PingModule } from './modules/ping/ping.module';

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

const commandManager = new CommandManagerService(token, clientId, guildId);
commandManager.initialize([new PingModule(), new PartyModule()]);

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
