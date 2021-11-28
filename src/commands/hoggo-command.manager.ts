import { SlashCommandBuilder } from '@discordjs/builders';
import {
    Routes,
    RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import Collection from '@discordjs/collection';
import { AbstractHoggoCommand } from './hoggo-command.interface';
import { PingCommand } from './ping.command';
import { PartyCommand } from './party.command';
import { PartyManager } from '../states/party.manager';

export class HoggoCommandManager {
    protected commands: Collection<string, AbstractHoggoCommand>;
    protected partyManager: PartyManager;

    constructor(
        private readonly _token: string,
        private readonly _clientId: string,
        private readonly _guildId: string
    ) {
        this.commands = new Collection();
        this.partyManager = new PartyManager();
    }

    public initialize(): void {
        this.registerCommand(new PingCommand());
        this.registerCommand(new PartyCommand(this.partyManager));

        this._registerCommandEndpoints();
    }

    public registerCommand(command: AbstractHoggoCommand): void {
        this.commands.set(command.name, command);
    }

    public getCommand(name: string) {
        return this.commands.get(name);
    }

    private _convertToJSON(
        command: AbstractHoggoCommand
    ): RESTPostAPIApplicationCommandsJSONBody {
        const { name, description } = command;

        const commandBuilder = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description);

        this._handleSubCommands(command, commandBuilder);

        return commandBuilder.toJSON();
    }

    private _handleSubCommands(
        command: AbstractHoggoCommand,
        commandBuilder: SlashCommandBuilder
    ) {
        if (command.hasSubCommands()) {
            const subCommands = command.getSubCommands();

            subCommands.forEach((subCommand) => {
                commandBuilder.addSubcommand((builderSubCommand) =>
                    builderSubCommand
                        .setName(subCommand.name)
                        .setDescription(subCommand.description)
                );
            });
        }
    }

    public getAllCommandsJSON(): RESTPostAPIApplicationCommandsJSONBody[] {
        return this.commands.map((command) => this._convertToJSON(command));
    }

    private _registerCommandEndpoints(): void {
        const commandsJson = this.getAllCommandsJSON();
        const rest = new REST({ version: '9' }).setToken(this._token);

        rest.put(
            Routes.applicationGuildCommands(this._clientId, this._guildId),
            {
                body: commandsJson
            }
        )
            .then(() =>
                console.log('Successfully registered application commands.')
            )
            .catch((error) =>
                console.log(
                    `Error occured in registering application commands: ${error}`
                )
            );
    }
}
