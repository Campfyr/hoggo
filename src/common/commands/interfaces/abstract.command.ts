import { SlashCommandBuilder } from '@discordjs/builders';
import Collection from '@discordjs/collection';
import { RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v9';
import { CacheType, CommandInteraction } from 'discord.js';
import { AbstractSubCommand } from './abstract.subcommand';

export abstract class AbstractCommand {
    protected readonly subCommandMap: Collection<string, AbstractSubCommand>;
    protected readonly commandBuilder: SlashCommandBuilder;

    constructor(public name: string, public description: string) {
        this.subCommandMap = new Collection();
        this.commandBuilder = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description);
    }

    /**
     * Fires whenever the command is ready for execution.
     * @param interaction
     */
    public abstract onExecute(
        interaction: CommandInteraction<CacheType>
    ): Promise<void>;

    public async execute(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        if (this.hasSubCommands()) {
            const firedSubCommandName = interaction.options.getSubcommand();
            const firedSubCommand = this.getSubCommand(firedSubCommandName);
            return firedSubCommand.onExecute(interaction);
        }

        await this.onExecute(interaction);
    }

    public addSubCommand(subCommand: AbstractSubCommand): AbstractCommand {
        this.subCommandMap.set(subCommand.name, subCommand);
        return this;
    }

    public addSubCommands(subCommands: AbstractSubCommand[]): AbstractCommand {
        subCommands.forEach((subCommand) => {
            this.addSubCommand(subCommand);
        });

        return this;
    }

    public getSubCommand(name: string): AbstractSubCommand {
        return this.subCommandMap.get(name);
    }
    public getSubCommands(): AbstractSubCommand[] {
        return Array.from(this.subCommandMap.values());
    }

    public hasSubCommands(): boolean {
        return this.subCommandMap.size > 0;
    }

    public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
        const subCommands = this.getSubCommands();

        subCommands.forEach((subCommand) => {
            this.commandBuilder.addSubcommand(subCommand.getCommandBuilder());
        });

        return this.commandBuilder.toJSON();
    }

    public getCommandBuilder(): SlashCommandBuilder {
        return this.commandBuilder;
    }
}
