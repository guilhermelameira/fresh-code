export interface DirectoryNode {
    name: string;
    path: string;
    parent: DirectoryNode | null ;  // head if this is null
    children: DirectoryNode[];      
    freshnessScore: number;
}

export interface BlameData {
    commitHash: string
    author: string
    timestamp: number
}

export interface FileBlame {
    filePath: string
    blameData: BlameData[]
}