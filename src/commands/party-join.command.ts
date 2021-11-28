import { CacheType, CommandInteraction } from 'discord.js';
import { AbstractHoggoCommand } from './hoggo-command.interface';

export class PartyJoinCommand extends AbstractHoggoCommand {
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