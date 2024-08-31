import React from "react";
import { GenericBlock, ThreeGridBoxBlock } from "@demo/shared";

export const isThreeGridBoxBlock = (block: GenericBlock): block is ThreeGridBoxBlock => {
    return block.__typename === "Article_Content_ThreeGridBox";
};

export const ThreeGridBoxBlockComponent = ({ block }: { block: ThreeGridBoxBlock }) => {
    if (!block.boxes || block.boxes.length < 1) {
        return null;
    }

    return (
        <section className="bg-white dark:bg-gray-900 rounded-lg border border-gray-300">
            <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
                <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                    {block.boxes.map((box, index) => {
                        return (
                            <div key={index} className="flex flex-col justify-center items-center">
                                <div className="flex justify-center items-center mb-4 rounded-full bg-primary-100 w-40 h-40 dark:bg-primary-900">
                                    {box.icon ? <img src={box.icon} alt={box.title} /> : null}
                                </div>
                                <h3 className="mb-2 text-xl font-bold dark:text-white">
                                    {box.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {box.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
