import Collection from '@discordjs/collection';
import { Party } from './party.interface';
import { User } from 'discord.js';
import * as randomWords from 'random-words';

export class PartyManager {
    protected parties: Collection<string, Party>;

    constructor() {
        this.parties = new Collection();
    }

    public createPartyId(): string {
        return randomWords({
            exactly: 1,
            wordsPerString: 2,
            separator: '-',
            maxLength: 4
        })[0];
    }

    public createParty(owner: User, limit: number): Party {
        const id = this.createPartyId();

        const party: Party = {
            id,
            limit,
            participants: [owner]
        };

        this.parties.set(id, party);

        return party;
    }

    public joinParty(partyId: string, participant: User): void {
        if (!this.hasParty(partyId)) {
            throw 'Party not found';
        }
        const partyParticipants = this.getPartyParticipants(partyId);
        partyParticipants.push(participant);
    }

    public leaveParty(partyId: string, participant: User): void {
        if (!this.hasParty(partyId)) {
            throw 'Party not found';
        }

        if (!this.hasPartyParticipant(partyId, participant)) {
            throw 'Participant is not part of party';
        }

        const party = this.getParty(partyId);
        const joinedPartyParticipants = party.participants;
        const filteredOutParticipants = joinedPartyParticipants.filter(
            (joinedParticipant) => joinedParticipant.id !== participant.id
        );

        party.participants = filteredOutParticipants;
    }

    public hasParty(partyId: string): boolean {
        return this.parties.has(partyId);
    }

    public getParty(partyId: string): Party {
        return this.parties.get(partyId);
    }

    public hasPartyParticipant(partyId: string, participant: User) {
        const partyParticipants = this.getPartyParticipants(partyId);
        return partyParticipants.includes(participant);
    }

    public getPartyParticipants(partyId: string): User[] {
        const party = this.getParty(partyId);
        return party.participants;
    }

    public getParties(): Party[] {
        return Array.from(this.parties.values());
    }

    public getLastParty(): Party {
        const parties = this.getParties();
        return parties[parties.length - 1];
    }
}
