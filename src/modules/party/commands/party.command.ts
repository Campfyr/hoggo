import { AbstractCommand } from '../../../common/commands/interfaces/abstract.command';
import { CacheType, CommandInteraction } from 'discord.js';
import { PartyCreateCommand } from './party-create.command';
import { PartyJoinCommand } from './party-join.command';
import { PartyManagerService } from '../services/party-manager.service';

export const GameList = ['Valorant'];

export class PartyCommand extends AbstractCommand {
    constructor(private readonly _partyManager: PartyManagerService) {
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
