import {BlameData, DirectoryNode, FileBlame} from "../types/BackendTypes";
import * as fs from "fs";
import * as path from "path";
import {REPO_DIR} from "../Main";

export function printFreshnessRecursively(root: DirectoryNode, tabs: number, refTime: number) {
    if (root.children.length === 0) {
        let freshness = getFreshness(parseFile(root.path), refTime);
        console.log(`${"\t".repeat(tabs)}${root.path}\t${freshness}`)
    } else {
        for (let child of root.children) {
            printFreshnessRecursively(child, tabs + 1, refTime);
        }
    }
}

export function getFreshness(file: FileBlame, refTime: number): number {
    let val: number = 0.0;
    file.blameData.forEach((b: BlameData) => {
        const timeVal = (refTime - b.timestamp) / 604800;
        val += Math.exp(-0.03 * timeVal);
    });
    return 100 * val / file.blameData.length
}

export function getOwnership(file: FileBlame, refTime: number): Map<string, [number, number]> {
    let val: Map<string, [number, number]> = new Map<string, [number, number]>();
    file.blameData.forEach((b: BlameData) => {
        let cur = val.get(b.author) || [0, 0];
        const timeVal = (refTime - b.timestamp) / 604800;
        val.set(b.author, [cur[0] + (100 * Math.exp(-0.03 * timeVal)), cur[1] + 1]);
    });
    val.forEach((value, key) => {
        val.set(key, [value[0] / file.blameData.length, value[1]])
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
            const author = tokens[2].substring(
                tokens[2].lastIndexOf("<") + 1,
                tokens[2].lastIndexOf(">")
            );
            const timestamp = parseInt(tokens[3], 10);
            return {
                commitHash,
                author,
                timestamp
            } as BlameData
        });
        return {
            filePath,
            lineCount: lines.length,
            blameData
        } as FileBlame
    } catch (err) {
        console.log("Failed to open file", err);
        return {} as FileBlame
    }
}