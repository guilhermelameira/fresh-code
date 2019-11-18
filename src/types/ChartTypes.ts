import { string } from "@amcharts/amcharts4/core";

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
    image?: string;
}

export interface ChartDataBranch {
    name: string;
    heat?: number;
    info: InfoElement[];
    image?: string;
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



