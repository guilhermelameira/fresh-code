export interface DirectoryNode {
    name: string;
    path: string;
    parent: DirectoryNode | null ;  // head if this is null
    children: DirectoryNode[];
    lineCount: number
    freshnessScore: number;
    ownership?: Map<string, [number, number]> // map of contributor name to [ownership, line_count]
}

export interface BlameData {
    commitHash: string
    author: string
    timestamp: number
}

export interface FileBlame {
    filePath: string
    lineCount: number
    blameData: BlameData[]
}