import { AbstractCommand } from '../commands/interfaces/abstract.command';

export interface IModule {
    getCommands(): AbstractCommand[];
}
