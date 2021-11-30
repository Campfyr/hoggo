import { AbstractCommand } from '../../common/commands/interfaces/abstract.command';
import { EmojiDigitUtil } from '../../common/utils/emoji-digit.util';
import { PartyCreateSubCommand } from './commands/subcommands/party-create.subcommand';
import { PartyCommand } from './commands/party.command';
import { PartyManagerService } from './services/party-manager.service';
import { PartyJoinSubCommand } from './commands/subcommands/party-join.subcommand';

export class PartyModule {
    protected partyManagerService: PartyManagerService;
    protected emojiDigitUtil: EmojiDigitUtil;

    constructor() {
        this.partyManagerService = new PartyManagerService();
    }

    public getCommands(): AbstractCommand[] {
        return [
            new PartyCommand().addSubCommands([
                new PartyCreateSubCommand(
                    this.partyManagerService,
                    this.emojiDigitUtil
                ),
                new PartyJoinSubCommand()
            ])
        ];
    }
}
