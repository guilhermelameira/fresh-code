export interface ChartProps {
    repo: Repo;
}

export type Repo = ChartDataNode;

export type ChartDataNode = (ChartDataBranch | ChartDataLeaf);

export interface ChartDataLeaf {
    name: string;
    size: number;
    heat?: number;
    info: InfoElement[];
}

export interface ChartDataBranch {
    name: string;
    heat?: number;
    info: InfoElement[];
    children: ChartDataNode[];
}

export interface InfoElement {
    name: string;
    value: number | string;
}

export function isBranch(node: ChartDataNode): node is ChartDataBranch {
    return (node as ChartDataBranch).children !== undefined;
}

export function isLeaf(node: ChartDataNode): node is ChartDataBranch {
    return (node as ChartDataBranch).children === undefined;
}