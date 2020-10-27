export interface Size {
    width: number;
    height: number;
}
export interface Layout {
    type: "vertical" | "horizontal";
    main: Size;
    rest: Size;
}
export declare function getLayout(box: Size, videoSizes: Size[]): Layout;
//# sourceMappingURL=layout.d.ts.map