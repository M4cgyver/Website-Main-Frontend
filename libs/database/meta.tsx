import { StaticImageData } from "next/image";

export interface Metadata {
    title: string;
    location: string;
    category: string;
    descShort: string;
    descLong: string;
    icon: StaticImageData;
    iconBackground: string;
    published: number | Date;
    edited: number[] | Date[];
}