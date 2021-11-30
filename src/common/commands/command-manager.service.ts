import {
    Routes,
    RESTPostAPIApplicationCommandsJSONBody
} from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import Collection from '@discordjs/collection';
import { AbstractCommand } from './interfaces/abstract.command';
import { IModule } from '../interfaces/module.interface';

export class CommandManagerService {
    protected commands: Collection<string, AbstractCommand>;

    constructor(
        private readonly _token: string,
        private readonly _clientId: string,
        private readonly _guildId: string
    ) {
        this.commands = new Collection();
    }

    public initialize(modules: IModule[]): void {
        modules.forEach((module) => {
            this.registerCommandsFromModule(module);
        });

        this._registerCommandEndpoints();
    }

    public registerCommandsFromModule(module: IModule) {
        this.registerCommands(module.getCommands());
    }

    public registerCommands(commands: AbstractCommand[]): void {
        commands.forEach((command) => {
            this.registerCommand(command);
        });
    }

    public registerCommand(command: AbstractCommand): void {
        this.commands.set(command.name, command);
    }

    public getCommand(name: string) {
        return this.commands.get(name);
    }

    public getAllCommandsJSON(): RESTPostAPIApplicationCommandsJSONBody[] {
        return this.commands.map((command) => command.toJSON());
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
