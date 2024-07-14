"use client";

import React, { ReactNode, useState } from "react";
import styles from "./styles.module.css";
import Link from "next/link";

interface SlideshowProps {
    slideClassName?: string
    buttonsClassName?: string;
    children: ReactNode;
}

export const Slideshow = ({ buttonsClassName, slideClassName, children }: SlideshowProps) => {
    // The current selected index
    const [activeIndex, setActiveIndex] = useState(0);

    // Enwrap all the slides in a div
    const slides = React.Children.map(children, (child, index) => {
        return <div id={`slideshow-slide-${index}`} key={index} style={{marginRight: `20px`}}>
            {child}
        </div>
    });

    // Button action to translate the slide
    const buttonClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, index: number) => {
        e.preventDefault();

        setActiveIndex(index);
    };

    // Create the buttons
    const buttons = React.Children.map(children, (_, index) => (
        <Link href={`#slideshow-slide-${index}`} key={index} onClick={(e) => buttonClick(e, index)}>
            {index}
        </Link>
    ));

    // Create the complete slideshow
    return (
        <div>
            <style>{styles.slideStyles}</style>
            
            <div className={styles.slideshowContainer}>
                <div className={`${styles.slideshowSlides} ${slideClassName}`} style={{marginLeft: `calc((min(25vw, 25vh) + 20px) * -${activeIndex})`}}>
                    {slides}
                </div>
            </div>
            
            <div className={`${styles.slideshowButtons} ${buttonsClassName}`}>
                {buttons}
            </div>
        </div>
    );
};
