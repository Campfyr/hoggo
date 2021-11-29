import { CacheType, CommandInteraction } from 'discord.js';
import { AbstractCommand } from '../../../common/commands/interfaces/abstract.command';

export class PingCommand extends AbstractCommand {
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
