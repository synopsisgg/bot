import { readdir } from 'node:fs/promises';

import { Collection } from '@discordjs/collection';
import inquirer from 'inquirer';

import { getModules } from '~/modules';
import { type Script } from '~/types/scripts';
import { env } from '~/utils/env';

const main = async () => {
    const allFiles = await readdir('./scripts');
    const files = allFiles
        .filter((file) => file !== 'index.ts')
        .map((file) => file.replace('.ts', ''));

    const scripts = await Promise.all(
        files.map(async (file) => {
            const scriptObj = (await import(`./${file}`)) as { script: Script };

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (typeof scriptObj?.script?.run !== 'function') {
                throw new TypeError(`Invalid script ${file}`);
            }

            return { ...scriptObj.script, file };
        })
    );

    const promptResults = await inquirer.prompt<{ script: string }>({
        type: 'list',
        choices: scripts.map((script) =>
            `${script.file}${script.description ? ` - ${script.description}` : ''}`.trim()
        ),
        name: 'script',
        message: 'Select a script to run!',
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const answer = promptResults.script.split(' - ')[0]!;

    const script = scripts.find((script) => script.file === answer);
    if (!script) throw new Error('?');

    switch (script.type) {
        case 'db': {
            const { makeDatabase } = await import('@synopsis/db');

            const { db, pool } = makeDatabase({
                host: env.DB_HOST,
                user: env.DB_USERNAME,
                password: env.DB_PASSWORD,
                database: env.DB_NAME,
                logger: true,
            });
            await script.run({ db });
            void pool.end();
            // eslint-disable-next-line unicorn/no-process-exit
            process.exit();
        }
        // eslint-disable-next-line no-fallthrough
        case 'bot': {
            const { Bot } = await import('~/bot');
            const bot = new Bot({
                events: new Collection(),
                commands: new Collection(),
                modules: await getModules(),
            });

            await bot.initialize();
            await script.run({ bot });
            await bot.stop();
            break;
        }
        case 'cache': {
            throw new Error('Not implemented yet!');
        }
        case 'api': {
            const { ApiClient } = await import('@twurple/api');
            const { AppTokenAuthProvider } = await import('@twurple/auth');

            const authProvider = new AppTokenAuthProvider(
                env.TWITCH_CLIENT_ID,
                env.TWITCH_CLIENT_SECRET
            );

            const api = new ApiClient({ authProvider });
            await script.run({ api });
            break;
        }
        case 'chat': {
            throw new Error('Not implemented yet!');
        }
        case 'standalone': {
            await script.run();
        }
    }
};

void main();