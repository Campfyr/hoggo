import { CacheType, CommandInteraction } from 'discord.js';
import { AbstractSubCommand } from '../../../../common/commands/interfaces/abstract.subcommand';

export class PartyJoinSubCommand extends AbstractSubCommand {
    constructor() {
        super('join', 'This is a party join command');
        this.commandBuilder.addStringOption((option) =>
            option
                .setName('party_id')
                .setDescription('The name of the party')
                .setRequired(true)
        );
    }

    public async onExecute(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        const partyName = interaction.options.getString('party_id');

        return interaction.reply(`Tried to join party: ${partyName}`);
    }
}
