declare module 'dom-to-image-more' {
    interface Options {
        quality?: number;
        scale?: number;
        filter?: (node: Node) => boolean;
        bgcolor?: string;
        style?: Record<string, string>;
        width?: number;
        height?: number;
        cacheBust?: boolean;
    }

    function toPng(node: Node, options?: Options): Promise<string>;
    function toJpeg(node: Node, options?: Options): Promise<string>;
    function toSvg(node: Node, options?: Options): Promise<string>;
    function toBlob(node: Node, options?: Options): Promise<Blob>;
    function toPixelData(node: Node, options?: Options): Promise<Uint8ClampedArray>;

    export { toPng, toJpeg, toSvg, toBlob, toPixelData, Options };
}
