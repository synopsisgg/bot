import { IconBrandGithub, IconBrandTwitch, IconMail } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { type PropsWithChildren } from 'react';

import synopsisBlack from '../../public/synopsisblack.png';
import { Button } from './button';
import { ThemeSwitch } from './theme-switch';
import { tw } from '~/utils/tw';

export function Header() {
    return (
        <Link href="/">
            <Image
                src={synopsisBlack}
                className="w-[350px] pt-8 dark:invert"
                alt=""
                priority={true}
            />
        </Link>
    );
}

export function Footer() {
    return (
        <div className="flex flex-row gap-7 pb-8">
            {[
                { link: 'https://twitch.tv/synopsisbot', Icon: IconBrandTwitch },
                { link: 'https://github.com/synopsisgg/bot', Icon: IconBrandGithub },
                { link: 'mailto:contact@synopsis.gg', Icon: IconMail },
            ].map(({ link, Icon }, i) => (
                <Link href={link} target="_blank" rel="noreferrer" key={i}>
                    <Button variant="ghost" size="lg" className="h-fit w-fit rounded-full p-3">
                        <Icon className="h-6 w-6" />
                    </Button>
                </Link>
            ))}
            <ThemeSwitch variant="ghost" className="h-fit w-fit rounded-full p-3" />
        </div>
    );
}

export function PageBase({ children, className }: PropsWithChildren<{ className?: string }>) {
    return (
        <div
            className={tw(
                'container mx-auto flex min-h-screen flex-col items-center justify-center gap-8',
                className
            )}
        >
            <Header />
            {children}
            <Footer />
        </div>
    );
}
