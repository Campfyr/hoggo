import { AbstractCommand } from '../../common/commands/interfaces/abstract.command';
import { PartyCommand } from './commands/party.command';
import { PartyManagerService } from './services/party-manager.service';

export class PartyModule {
    protected partyManagerService: PartyManagerService;

    constructor() {
        this.partyManagerService = new PartyManagerService();
    }

    public getCommands(): AbstractCommand[] {
        return [new PartyCommand(this.partyManagerService)];
    }
}
