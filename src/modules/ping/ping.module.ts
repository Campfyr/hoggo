import { AbstractCommand } from '../../common/commands/interfaces/abstract.command';
import { IModule } from '../../common/interfaces/module.interface';
import { PingCommand } from './commands/ping.command';

export class PingModule implements IModule {
    getCommands(): AbstractCommand[] {
        return [new PingCommand()];
    }
}
