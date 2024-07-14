import Image from "next/image";
import styles from "./index.module.css";

import imageYesterweb from "@/public/static/images/frens/yesterweb-radio-button.png";
import imageYesterwebForum from "@/public/static/images/frens/ywforum.png";
import image5AMGirlfriend from "@/public/static/images/frens/5am.webp";
import imageOekaki from "@/public/static/images/frens/fatass.webp";
import imageDaikonet from "@/public/static/images/frens/link_uxo.webp";
import imageDoko from "@/public/static/images/frens/dokodemobutton2.gif";
import image99Gifshop from "@/public/static/images/frens/88x31.1.png";

const links = [
    {
        url: "https://yesterweb.org/radio/",
        imgSrc: imageYesterweb,
        title: "The link navigates to the Yesterweb's radio. collection of resources that document and preserve the history of the early web...",
        alt: "Yesterweb's Radio"
    },
    {
        url: "/projects/archives/viewer?uri=http%3A%2F%2Fforum.yesterweb.org%2F",
        imgSrc: imageYesterwebForum,
        title: "Yesterweb's dead forum. Dont ask me how it died...",
        alt: "Yesterweb's Forum"
    },
    {
        url: "https://5amgirlfriend.neocities.org/",
        imgSrc: image5AMGirlfriend,
        title: "5am Girlfriend is a webpage made by `Five` (screen name), designed to be a personal bloggind site with art and music...",
        alt: "5am Girlfriend"
    },
    {
        url: "https://oekaki.freakphone.net/",
        imgSrc: imageOekaki,
        title: "Oekaki.freakphone.net is an online platform for drawing and sharing illustrations...",
        alt: "Oekaki.freakphone.net drawing"
    },
    {
        url: "https://daikonet.neocities.org/",
        imgSrc: imageDaikonet,
        title: "Daiko (or sometimes known by his other screename \"Hogwash\") is a weebshit, web and compsci enthusiest...",
        alt: "Daikonet.neocities.org"
    },
    {
        url: "https://dokode.moe/",
        imgSrc: imageDoko,
        title: "Chill guy, loved the website and the general asthetic. Hes got a bunch of html tutorials for beginners",
        alt: "Japanese text or something"
    },
    {
        url: "https://99gifshop.neocities.org/",
        imgSrc: image99Gifshop,
        title: "99Gifshop is an online platform for drawing and sharing illustrations...",
        alt: "99Gifshop.neocities.org"
    },
];

const LinksFriends = () => {
    return (
        <>
            {links.map(friend => (
                <a key={friend.url} href={friend.url} target="_blank" rel="noopener noreferrer">
                    <Image src={friend.imgSrc} title={friend.title} alt={friend.alt} width={81} height={31} />
                </a>
            ))}
        </>
    );
};

export default LinksFriends;
