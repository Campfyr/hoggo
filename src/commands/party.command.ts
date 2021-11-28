import { AbstractHoggoCommand } from './hoggo-command.interface';
import { CacheType, CommandInteraction } from 'discord.js';
import { PartyCreateCommand } from './party-create.command';
import { PartyJoinCommand } from './party-join.command';
import { PartyManager } from '../states/party.manager';

export const GameList = ['Valorant'];

export class PartyCommand extends AbstractHoggoCommand {
    constructor(private readonly _partyManager: PartyManager) {
        super('party', 'This is the party parent command', [
            new PartyCreateCommand(_partyManager),
            new PartyJoinCommand()
        ]);
    }

    public async handleCommand(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        return interaction.reply(
            `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
        );
    }
}
