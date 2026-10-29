import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
}

const users: User[] = [
    {
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        passwordHash: bcrypt.hashSync('demo1234', 10),
    },
];

export function findUserByEmail(email: string): User | undefined {
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data: { name: string; email: string; passwordHash: string }): User {
    const user: User = {
        id: randomUUID(),
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
    };

    users.push(user);

    return user;
}
