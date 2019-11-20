import {BlameData, DirectoryNode, FileBlame} from "../types/BackendTypes";
import * as fs from "fs";
import * as path from "path";
import {REPO_DIR} from "../Main";

export function printFreshness(root: DirectoryNode, tabs: number, refTime: number) {
    if (root.children.length === 0) {
        let freshness = getFreshness(parseFile(root.path), refTime);
        console.log(`${"\t".repeat(tabs)}${root.path}\t${freshness}`)
    } else {
        for (let child of root.children) {
            printFreshness(child, tabs + 1, refTime);
        }
    }
}

export function getFreshness(file: FileBlame, refTime: number): number {
    let val: number = 0.0;
    file.blameData.forEach((b: BlameData) => {
        const timeVal = (refTime - b.timestamp) / 604800;
        val += 100 * Math.exp(-0.03 * timeVal);
    });
    return val / file.blameData.length
}

export function getOwnership(file: FileBlame): Map<string, number> {
    let val: Map<string, number> = new Map<string, number>();
    file.blameData.forEach((b: BlameData) => {
        let cur = val.get(b.author) || 0;
        val.set(b.author, cur + (100 * Math.exp(-0.03 * b.timestamp)));
    });
    val.forEach((value, key) => {
        val.set(key, value / file.blameData.length)
    });
    return val;
}

export function parseFile(filePath: string): FileBlame {
    try {
        const file = fs.readFileSync(path.join(REPO_DIR, filePath + ".adat")).toString('utf-8')
        let lines: string[] = file.trim().split('\n');
        const blameData: BlameData[] = lines.map((l: string) => {
            let tokens = l.match(/\S+/g) as string[];
            // console.log("TOKENS", tokens[0], tokens[1], tokens[2]);
            const commitHash = tokens[0];
            const author = tokens[2];
            const timestamp = parseInt(tokens[3], 10);
            return {
                commitHash,
                author,
                timestamp
            } as BlameData
        });
        return {
            filePath,
            blameData
        } as FileBlame
    } catch (err) {
        console.log("Failed to open file", err);
        return {} as FileBlame
    }
}