import { CacheType, CommandInteraction } from 'discord.js';
import { AbstractHoggoCommand } from './hoggo-command.interface';

export class PingCommand extends AbstractHoggoCommand {
    constructor() {
        super('ping', 'This is a friendly ping command');
    }

    public async handleCommand(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        return interaction.reply(
            `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
        );
    }
}
