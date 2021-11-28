import { User } from 'discord.js';

export interface Party {
    id: string;
    limit: number;
    participants: User[];
}
