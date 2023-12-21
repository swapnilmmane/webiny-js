import { Plugin } from "@webiny/plugins";
import {
    AssetRequestResolver,
    AssetResolver,
    AssetProcessor,
    AssetOutputStrategy,
    AssetRequest,
    Asset,
    AssetTransformationStrategy
} from "~/delivery";
import { FileManagerContext } from "~/types";
import { NullRequestResolver } from "~/delivery/AssetDelivery/NullRequestResolver";
import { NullAssetResolver } from "~/delivery/AssetDelivery/NullAssetResolver";
import { NullAssetOutputStrategy } from "./NullAssetOutputStrategy";
import { TransformationAssetProcessor } from "./transformation/TransformationAssetProcessor";
import { PassthroughAssetTransformationStrategy } from "./transformation/PassthroughAssetTransformationStrategy";

type Setter<T extends any[]> = T extends [...any, infer TLast] ? (...args: T) => TLast : never;

export type ImageResizeWidthsSetter = Setter<[number[]]>;
export type AssetRequestResolverDecorator = Setter<[AssetRequestResolver]>;
export type AssetResolverDecorator = Setter<[AssetResolver]>;
export type AssetProcessorDecorator = Setter<[FileManagerContext, AssetProcessor]>;
export type AssetTransformationDecorator = Setter<
    [FileManagerContext, AssetTransformationStrategy]
>;
export type AssetOutputStrategyDecorator = Setter<
    [FileManagerContext, AssetRequest, Asset, AssetOutputStrategy]
>;

export class AssetDeliveryConfigBuilder {
    private imageResizeWidths: ImageResizeWidthsSetter[] = [];
    private requestResolverDecorators: AssetRequestResolverDecorator[] = [];
    private assetResolverDecorators: AssetResolverDecorator[] = [];
    private assetProcessorDecorators: AssetProcessorDecorator[] = [];
    private assetTransformationStrategyDecorators: AssetTransformationDecorator[] = [];
    private assetOutputStrategyDecorators: AssetOutputStrategyDecorator[] = [];

    setImageResizeWidths(setter: ImageResizeWidthsSetter) {
        this.imageResizeWidths.push(setter);
    }

    decorateRequestResolver(decorator: AssetRequestResolverDecorator) {
        this.requestResolverDecorators.push(decorator);
    }

    decorateAssetResolver(decorator: AssetResolverDecorator) {
        this.assetResolverDecorators.push(decorator);
    }

    decorateAssetProcessor(decorator: AssetProcessorDecorator) {
        this.assetProcessorDecorators.push(decorator);
    }

    decorateAssetTransformationStrategy(decorator: AssetTransformationDecorator) {
        this.assetTransformationStrategyDecorators.push(decorator);
    }

    decorateAssetOutputStrategy(decorator: AssetOutputStrategyDecorator) {
        this.assetOutputStrategyDecorators.push(decorator);
    }

    /**
     * @internal
     */
    getImageResizeWidths() {
        return this.imageResizeWidths.reduce<number[]>((value, decorator) => decorator(value), []);
    }

    /**
     * @internal
     */
    getAssetRequestResolver() {
        return this.requestResolverDecorators.reduce<AssetRequestResolver>(
            (value, decorator) => decorator(value),
            new NullRequestResolver()
        );
    }

    /**
     * @internal
     */
    getAssetResolver() {
        return this.assetResolverDecorators.reduce<AssetResolver>(
            (value, decorator) => decorator(value),
            new NullAssetResolver()
        );
    }

    /**
     * @internal
     */
    getAssetProcessor(context: FileManagerContext) {
        return this.assetProcessorDecorators.reduce<AssetProcessor>(
            (value, decorator) => decorator(context, value),
            new TransformationAssetProcessor(this.getAssetTransformationStrategy(context))
        );
    }

    getAssetOutputStrategy(context: FileManagerContext, assetRequest: AssetRequest, asset: Asset) {
        return this.assetOutputStrategyDecorators.reduce<AssetOutputStrategy>(
            (value, decorator) => decorator(context, assetRequest, asset, value),
            new NullAssetOutputStrategy()
        );
    }

    getAssetTransformationStrategy(context: FileManagerContext) {
        return this.assetTransformationStrategyDecorators.reduce<AssetTransformationStrategy>(
            (value, decorator) => decorator(context, value),
            new PassthroughAssetTransformationStrategy()
        );
    }
}

export interface AssetDeliveryConfigModifier {
    (config: AssetDeliveryConfigBuilder): Promise<void> | void;
}

export class AssetDeliveryConfigModifierPlugin extends Plugin {
    public static override type = "fm.config-modifier";
    private readonly cb: AssetDeliveryConfigModifier;

    constructor(cb: AssetDeliveryConfigModifier) {
        super();
        this.cb = cb;
    }

    async buildConfig(configBuilder: AssetDeliveryConfigBuilder): Promise<void> {
        await this.cb(configBuilder);
    }
}

export const createAssetDeliveryConfig = (cb: AssetDeliveryConfigModifier) => {
    return new AssetDeliveryConfigModifierPlugin(cb);
};
