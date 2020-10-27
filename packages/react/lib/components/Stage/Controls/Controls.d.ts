import type { FabProps } from "@material-ui/core";
export interface ControlElement {
    name: string;
    icon: JSX.Element;
    onClick: () => void;
    color?: FabProps["color"];
}
export interface ControlsProps {
    controls: ControlElement[];
}
export declare function Controls(props: ControlsProps): JSX.Element;
//# sourceMappingURL=Controls.d.ts.map