declare module "colorthief" {
    type Color = [number, number, number];

    export default class ColorThief {
        getColor(
            sourceImage: HTMLImageElement | Buffer,
            quality?: number
        ): Color;
        getPalette(
            sourceImage: HTMLImageElement | Buffer,
            colorCount?: number,
            quality?: number
        ): Color[];
    }
}
