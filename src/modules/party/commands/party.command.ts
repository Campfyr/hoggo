import { AbstractCommand } from '../../../common/commands/interfaces/abstract.command';
import { CacheType, CommandInteraction } from 'discord.js';

export const GameList = ['Valorant'];

export class PartyCommand extends AbstractCommand {
    constructor() {
        super('party', 'This is the party parent command');
    }

    public async onExecute(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        return interaction.reply(
            `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
        );
    }
}
