import { User } from 'discord.js';

export interface Party {
    id: string;
    participants: User[];
}