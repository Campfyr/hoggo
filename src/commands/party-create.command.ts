import { AbstractHoggoCommand } from './hoggo-command.interface';
import {
    CacheType,
    CommandInteraction,
    Message,
    MessageEmbed,
    User
} from 'discord.js';
import { PartyManager } from '../states/party.manager';
import { Party } from '../states/party.interface';
import { EmojiDigitUtil } from '../utils/emoji-digit.util';

export class PartyCreateCommand extends AbstractHoggoCommand {
    protected emojiDigitUtil: EmojiDigitUtil;

    constructor(private readonly _partyManager: PartyManager) {
        super('create', 'This is the party create command');
        this.emojiDigitUtil = new EmojiDigitUtil();
    }

    private _getFormattedMemberList(description: string, participants: User[]) {
        const formattedParticipants = participants
            .map(
                (participant, index) =>
                    `${this.emojiDigitUtil.convertDigitToEmoji(index + 1)} ${
                        participant.username
                    }\n`
            )
            .join('');

        /* eslint-disable */
        return `${description} 
        \`\`\`Member List:\n${formattedParticipants}\`\`\``;
        /* eslint-enable */
    }

    private _getFilter() {
        return (message: Message) => {
            const messageContent = message.content;
            const commandList = ['join', 'leave'];
            const messageContentList = messageContent.split(' ');
            const isValidCommand = messageContentList.find((word) =>
                commandList.includes(word.toLowerCase())
            );
            const isHuman = !message.author.bot;
            return isValidCommand && isHuman;
        };
    }

    public async handleCommand(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        const commandAuthor = interaction.user;
        const party = this._partyManager.createParty(commandAuthor, -1);

        const partyEmbed = this._createPartyEmbed(party);

        this._handleMessageCollector(interaction, partyEmbed, party);

        await interaction.reply({
            embeds: [partyEmbed]
        });
    }

    private _createPartyEmbed({ id: partyId, participants }: Party) {
        const description = `A game party \`${partyId}\` was created :tada:!\n`;
        const formattedMemberList = this._getFormattedMemberList(
            description,
            participants
        );

        const partyEmbed = new MessageEmbed()
            .setColor('#F0C14D')
            .setAuthor('Party Builder', 'https://i.imgur.com/AfFp7pu.png')
            .setTitle(`Party`)
            .setDescription(formattedMemberList)
            .setThumbnail('https://i.imgur.com/AfFp7pu.png');

        return partyEmbed;
    }

    private _handleMessageCollector(
        interaction: CommandInteraction<CacheType>,
        partyEmbed: MessageEmbed,
        { id: partyId }: Party
    ) {
        const collector = interaction.channel.createMessageCollector({
            filter: this._getFilter(),
            time: 1000 * 60 * 5
        });

        collector.on('collect', (message: Message) => {
            this._onCollectorCollect(interaction, message, partyEmbed, partyId);
        });

        collector.on('end', (collected) => {
            this._onCollectorEnd(interaction, partyEmbed);
        });
    }

    private _onCollectorCollect(
        interaction: CommandInteraction<CacheType>,
        message: Message,
        partyEmbed: MessageEmbed,
        partyId: string
    ) {
        const messageContent = message.content;
        const messageWordList = messageContent.split(' ');

        type MessageCommand = { key?: string; param?: string };

        const messageCommand: MessageCommand = messageWordList.reduce(
            (prev, curr, index, wordArr) => {
                const commandList = ['join', 'leave'];

                const commandKeyWord = messageWordList.find((word) =>
                    commandList.includes(curr.toLowerCase())
                );
                const isLastElement = index === wordArr.length - 1;
                const commandParam = !isLastElement ? wordArr[index + 1] : '';

                switch (commandKeyWord) {
                    case 'join':
                        return {
                            key: 'join',
                            ...(commandParam
                                ? { param: commandParam }
                                : ({} as MessageCommand))
                        };
                    case 'leave':
                        return { key: 'leave' };
                }
                return prev;
            },
            {} as MessageCommand
        );

        const memberAlreadyExists = this._partyManager.hasPartyParticipant(
            partyId,
            message.author
        );

        const partyIdParam = messageCommand.param;
        const isSamePartyId = partyIdParam === partyId;
        const commandKey = messageCommand.key;

        switch (commandKey) {
            case 'join':
                if (memberAlreadyExists) {
                    interaction.followUp({
                        content: `:no_entry_sign:  ${message.author.username} already joined Party \`${partyId}\`.`
                    });
                    return;
                }
                if (isSamePartyId) {
                    this._partyManager.joinParty(partyId, message.author);

                    partyEmbed.setDescription(
                        this._getFormattedMemberList(
                            `:white_check_mark:  ${message.author.username} joined Party \`${partyId}\`.`,
                            this._partyManager.getPartyParticipants(partyId)
                        )
                    );

                    interaction.followUp({ embeds: [partyEmbed] });
                    return;
                }
                if (!this._partyManager.hasParty(partyIdParam)) {
                    interaction.followUp(
                        `:no_entry_sign:  Party does not exist`
                    );
                    return;
                }
                break;
            case 'leave':
                if (!memberAlreadyExists) {
                    interaction.followUp({
                        content: `:no_entry_sign:  ${message.author.username} is not a member of \`${partyId}\`.`
                    });
                    return;
                }

                this._partyManager.leaveParty(partyId, message.author);

                partyEmbed.setDescription(
                    this._getFormattedMemberList(
                        `:leaves:  ${message.author.username} left Party \`${partyId}\`.`,
                        this._partyManager.getPartyParticipants(partyId)
                    )
                );
                interaction.followUp({ embeds: [partyEmbed] });
                break;
        }
    }

    private _onCollectorEnd(
        interaction: CommandInteraction<CacheType>,
        partyEmbed: MessageEmbed
    ) {
        interaction.followUp({
            content: `Party timed out`,
            embeds: [partyEmbed]
        });
    }
}
