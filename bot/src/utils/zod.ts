import { z } from 'zod';

export const channelSchema = z
    .string()
    .regex(/^#?\w+$/i)
    .transform((v) => v.replace(/^#+/, ''));

export const channelModeSchema = z
    .enum(['readonly', 'offline-only', 'all'])
    .default('offline-only');