import { AbstractHoggoCommand } from './hoggo-command.interface';
import { CacheType, CommandInteraction, MessageEmbed } from 'discord.js';

export class PartyCreateCommand extends AbstractHoggoCommand {
    constructor() {
        super('create', 'This is the party create command');
    }

    public async handleCommand(
        interaction: CommandInteraction<CacheType>
    ): Promise<void> {
        const sample_items = [];

        const party_embed = new MessageEmbed()
            .setColor('#F0C14D')
            .setAuthor('Party Builder', 'https://i.imgur.com/AfFp7pu.png')
            .setTitle('Party')
            .setDescription('Kahit Ano bahala na')
            .setThumbnail('https://i.imgur.com/AfFp7pu.png');

        const collector_filter = (message) =>
            message.content.includes('discord');
        const collector = interaction.channel.createMessageCollector({
            filter: collector_filter,
            time: 15000
        });

        collector.on('collect', (m) => {
            sample_items.push(m);
            console.log(`Collected ${m.content}`);
        });

        collector.on('end', (collected) => {
            console.log(`Collected ${collected.size} items`);
        });

        return interaction.reply({
            content: sample_items.toString() || ' ',
            embeds: [party_embed]
        });
    }
}
