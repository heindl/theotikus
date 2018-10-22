/* tslint:disable:max-classes-per-file */

declare module "react-vis-force" {
  export interface ISimulationOptionsStrength {
    // see strengths in the d3-force documentation
    charge?: number; // | (...args: any[]): void
    collide?: number; // | (...args: any[]) void
    x?(params: { radius: number }): number;
    y?(params: { radius: number }): number;
  }

  export interface ISimulationOptions {
    animate?: boolean;
    height?: number | string;
    width?: number | string;
    alpha?: number;
    strength?: ISimulationOptionsStrength;
    alphaDecay?: number;
    alphaMin?: number;
    alphaTarget?: number;
    velocityDecay?: number;
    radiusMargin?: number;
    draggable?: boolean;
  }
  // linkAttrs: object[],
  // nodeAttrs: object[],

  export interface IForceGraphProps {
    zoom?: boolean;
    zoomOptions?: {
      minScale: number;
      maxScale: number;
      zoomSpeed: number;
      onZoom(event: object, scale: number): void;
      onPan(event: object, newX: number, newY: number): void;
    };
    simulationOptions?: ISimulationOptions;
    labelAttr?: string;
    labelOffset?: {
      x(node: INode): object;
      y(node: INode): object;
    };
    showLabels?: boolean;
  }

  export class ForceGraph extends React.Component<IForceGraphProps, {}> {}

  export interface INode {
    id: string;
    radius?: number;
    label?: string;
  }

  export interface IForceGraphNodeProps {
    fill: string;
    node: INode;
    className?: string | object;
  }

  export class ForceGraphNode extends React.Component<
    IForceGraphNodeProps,
    {}
  > {}

  export interface ILink {
    source: string;
    target: string;
    value?: number;
  }

  export interface IForceGraphLinkProps {
    link: ILink;
  }

  export class ForceGraphLink extends React.Component<
    IForceGraphLinkProps,
    {}
  > {}

  export interface InteractiveForceGraphProps {
    // Callback on deselect
    onDeselectNode?: (event: object, node: object) => void;
    // Callback on to select
    onSelectNode?: (event: object, node: object) => void;
    selectedNode?: object;
    defaultSelectedNode?: object;
    highlightDependencies?: boolean;
    opacityFactor?: number;
    className?: string | object;
  }

  class InteractiveForceGraph extends React.Component<
    IForceGraphProps & InteractiveForceGraphProps,
    {}
  > {}
}
