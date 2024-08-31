import React from "react";
import { ArticleHeroImage } from "@demo/shared";

interface HeroImageProps {
    heroImages: ArticleHeroImage[];
}

export const HeroImage = ({ heroImages }: HeroImageProps) => {
    // TODO: decide on which culture group to use
    if (!heroImages || heroImages.length < 1) {
        return null;
    }

    const heroImage = heroImages[0];

    return <img src={heroImage.image} />;
};
