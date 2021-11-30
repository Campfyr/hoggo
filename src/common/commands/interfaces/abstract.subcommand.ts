import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { APIApplicationCommandSubCommandOptions } from 'discord-api-types/v9';
import { CacheType, CommandInteraction } from 'discord.js';

export abstract class AbstractSubCommand {
    protected readonly commandBuilder: SlashCommandSubcommandBuilder;

    constructor(public name: string, public description: string) {
        this.commandBuilder = new SlashCommandSubcommandBuilder()
            .setName(name)
            .setDescription(description);
    }

    public abstract onExecute(
        interaction: CommandInteraction<CacheType>
    ): Promise<void>;

    public toJSON(): APIApplicationCommandSubCommandOptions {
        return this.commandBuilder.toJSON();
    }

    public getCommandBuilder(): SlashCommandSubcommandBuilder {
        return this.commandBuilder;
    }
}
