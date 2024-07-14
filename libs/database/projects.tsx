import { Metadata } from "./meta";

import imageNextJS13OrderedLayout from "@/public/static/images/blogsnextjs13flexandordericon.jpeg"
import imageAlbanian from "@/public/static/images/flagalbainain.png";
import imageNeo from "@/public/static/images/neocrying.png";
import imageTate from "@/public/static/images/photofunny.net_.jpg";
import imageStardew from "@/public/static/images/stardew2.webp";

export const getProjectsListing = async (): Promise<Metadata[]> => [
    {
        title: 'Bic Pen Island ',
        location: "/projects/friends/bic", category: "Friend",

        descShort: 'Hes like albanian. Apparently can wrestlea fat kid in the hallway dunno what that says about his bone density.',
        descLong: 'Hes like albanian. Apparently can wrestlea fat kid in the hallway dunno what that says about his bone density or not. Ill finish later he doesent know how to buila fucking pc',
        icon: imageAlbanian,
        iconBackground: 'rgba(214, 183, 157, .7)',
        published: new Date('2024-06-13'),
        edited: [new Date('2024-06-13')]
    },
    {
        title: 'Neo FULL DOX here',
        location: "/projects/friends/neo", category: "Friend",

        descShort: 'He plays Genshin Impact He plays Genshin Impact -rep cant even do basic math ong',
        descLong: 'He plays Genshin Impact He plays Genshin Impact -rep cant even do basic math ong',
        icon: imageNeo,
        iconBackground: 'rgba(214, 183, 157, .7)',
        published: new Date('2024-06-13'),
        edited: [new Date('2024-06-13')]
    }, {
        title: 'Cookies Petition ',
        location: "/projects/friends/neo", category: "Friend",

        descShort: 'This man was caught lacking with copper. Sign this petition to personally break him out!',
        descLong: 'This man was caught lacking with copper. Sign this petition to personally break him out!',
        icon: imageTate,
        iconBackground: 'rgba(214, 183, 157, .7)',
        published: new Date('2024-06-17'),
        edited: [new Date('2024-06-17')]
    }, {
        title: 'Casmiers Webpage',
        location: "/projects/friends/casmier", category: "Friend",
        descShort: 'He took too long to get back on Stardew Valley so I decided to slander him fucking cuck',
        descLong: 'He took too long to get back on Stardew Valley so I decided to slander him fucking cuck',
        icon: imageStardew,
        iconBackground: 'rgba(214, 183, 157, .7)',
        published: new Date('2024-06-20'),
        edited: [new Date('2024-06-20')]
    },
]