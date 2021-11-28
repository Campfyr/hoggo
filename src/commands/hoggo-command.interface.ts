import Collection from '@discordjs/collection';
import { CacheType, CommandInteraction } from 'discord.js';

export abstract class AbstractHoggoCommand {
    protected subCommandMap: Collection<string, AbstractHoggoCommand>;

    constructor(
        public name: string,
        public description: string,
        subCommands?: AbstractHoggoCommand[]
    ) {
        this.subCommandMap = new Collection();

        if (!subCommands) {
            return;
        }

        subCommands.forEach((subCommand) => {
            this.subCommandMap.set(subCommand.name, subCommand);
        });
    }

    public async execute(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        if (this.hasSubCommands()) {
            const firedSubCommandName = interaction.options.getSubcommand();
            return this.subCommandMap
                .get(firedSubCommandName)
                .execute(interaction);
        }

        await this.handleCommand(interaction);
    }

    public getSubCommands(): AbstractHoggoCommand[] {
        return Array.from(this.subCommandMap.values());
    }

    public hasSubCommands(): boolean {
        return this.subCommandMap.size > 0;
    }

    abstract handleCommand(
        interaction: CommandInteraction<CacheType>
    ): Promise<void>;
}
