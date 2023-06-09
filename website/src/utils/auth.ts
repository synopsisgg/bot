import { randomBytes } from 'node:crypto';

import { eq, states } from '@synopsis/db';

import { db } from './db';

export const createState = async () => {
    const state = randomBytes(16).toString('hex');
    await db.insert(states).values({ state });
    return state;
};

export const consumeState = async (state: string): Promise<{ ok: boolean }> => {
    const result = await db.delete(states).where(eq(states.state, state)).returning();
    if (result.length === 0) return { ok: false };
    return { ok: true };
};
