import { AbstractHoggoCommand } from './hoggo-command.interface';
import { CacheType, CommandInteraction, Message, MessageEmbed, User } from 'discord.js';
import { PartyManager } from '../states/party.manager';
import { Party } from '../states/party.interface';

export class PartyCreateCommand extends AbstractHoggoCommand {
    constructor(private readonly _partyManager: PartyManager) {
        super('create', 'This is the party create command');
    }

    public async handleCommand(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        const commandAuthor = interaction.user;
        const party = this._partyManager.createParty(commandAuthor);

        const { id: partyId, participants } = party as Party;

        const description = `A game party \`${partyId}\` was created\n`
        const getFormattedMemberList = () =>
            `${description} 
            \`\`\`
            Member List:\n ${participants.map((participant, index) => `${index + 1}: ${participant.username}\n`).join('')} 
            \`\`\``

        const partyEmbed = new MessageEmbed()
            .setColor('#F0C14D')
            .setAuthor('Party Builder', 'https://i.imgur.com/AfFp7pu.png')
            .setTitle(`Party`)
            .setDescription(getFormattedMemberList())
            .setThumbnail('https://i.imgur.com/AfFp7pu.png');

        const filter = (message: Message) => {
            const messageContent = message.content;
            const hasJoin = messageContent.toLowerCase().includes('join');
            const isHuman = !message.author.bot;
            return hasJoin && isHuman;
        };

        const collector = interaction.channel.createMessageCollector({ filter, time: 1000 * 15 });

        collector.on('collect', (message: Message) => {
            const messageContent = message.content;
            const messageWordList = messageContent.split(' ');
            const partyIdParam = messageWordList.reduce((prev, curr, index, wordArr) => {
                const isWordJoin = curr.toLowerCase() === 'join';
                const isLastElement = index === wordArr.length - 1;
                if (isWordJoin && !isLastElement) return wordArr[index + 1];
                return prev;
            }, '')

            const isSamePartyId = partyIdParam === partyId;
            const memberAlreadyExists = this._partyManager.hasPartyParticipant(partyId, message.author);

            if (memberAlreadyExists) {
                interaction.followUp({
                    content: `${message.author.username} already joined Party \`${partyId}\``,
                })
            } else if (isSamePartyId) {
                this._partyManager.joinParty(partyId, message.author);
                partyEmbed.setDescription(getFormattedMemberList());
                interaction.followUp({
                    content: `${message.author.username} is joining ${partyIdParam}`,
                    embeds: [partyEmbed]
                })
            } else if (!this._partyManager.hasParty(partyIdParam)) {
                interaction.followUp(`Party doesn't exist`)

            } else {
                // JOIN NEWEST PARTY
            }
        });

        collector.on('end', (collected) => {
            interaction.followUp({
                content: `Party timed out`,
                embeds: [partyEmbed]
            })
        });

        await interaction.reply({
            embeds: [partyEmbed]
        });
    }
}
