import type { Size } from "./layout";
export interface StageGridProps {
    sizes: Size[];
    children: Array<JSX.Element | null> | JSX.Element[];
}
export interface StageGridFixedProps extends StageGridProps {
    width: number;
    height: number;
}
export declare function StageGridFixed(props: StageGridFixedProps): JSX.Element | null;
export declare function StageGrid(props: StageGridProps): JSX.Element | null;
//# sourceMappingURL=StageGrid.d.ts.map