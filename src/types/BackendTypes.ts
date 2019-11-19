export interface DirectoryNode {
    name: string;
    path: string;
    parent: DirectoryNode | null ;  // head if this is null
    children: DirectoryNode[];      
    freshnessScore: number;
}