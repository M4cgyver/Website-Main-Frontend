import imageNextJS13OrderedLayout from "@/public/static/images/blogsnextjs13flexandordericon.jpeg"
import { Metadata } from "./meta"

export const getBlogListing = async (): Promise<Metadata[]> => [
    {
        title: 'NextJS App Ordered Layout.',
        location: "/blogs/nextjs-flexbox-ordered-layout",
        category: "Blog",
        descShort: 'Lean how to use Next 13+ with flex to intertwine components in the page with the layout.',
        descLong: 'Explore effective strategies for structuring your NextJS App layouts with precision. Learn how to arrange elements seamlessly within page.tsx and layout.tsx. Use styles, flexbox, and flexbox ordering to decupple the components ordering dependence to enhance user experience. ',
        icon: imageNextJS13OrderedLayout,
        iconBackground: 'rgba(214, 183, 157, .7)',
        published: new Date('2024-07-13'),
        edited: [new Date('2024-07-13')]
    }
]