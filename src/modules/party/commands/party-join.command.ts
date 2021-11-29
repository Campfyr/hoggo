import { CacheType, CommandInteraction } from 'discord.js';
import { AbstractCommand } from '../../../common/commands/interfaces/abstract.command';

export class PartyJoinCommand extends AbstractCommand {
    constructor() {
        super('join', 'This is a party join command');
    }

    public async handleCommand(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        return interaction.reply(
            `Tried to join party!`
        );
    }
}