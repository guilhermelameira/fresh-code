import {BlameData, DirectoryNode, FileBlame} from "../types/BackendTypes";
import * as fs from "fs";
import * as path from "path";
//import {REPO_DIR} from "../Main"; // TODO
const REPO_DIR = '../resources/clone/fresh-code'; /* TODO: this must be 
 created at runtime!!! */

function f(root: DirectoryNode) {

}

// note: very qualitative...
export function calculateFreshnessScore(file: FileBlame, refTime: number) {
    let val: number = 0.0;
    let dayCalculationDivisor = 60 * 60 * 24;
    file.blameData.forEach((b: BlameData) => {
        let dayBetween = ( refTime - b.timestamp)/ dayCalculationDivisor;
        // TODO fix
        //console.log(Math.exp(-0.03 * (refTime - b.timestamp)))
        //val += 100 * Math.exp(-0.03 * (refTime - b.timestamp));
        //console.log(( refTime - b.timestamp)/ dayCalculationDivisor )
        let lineValue = dayBetween > 150 ? 150 : dayBetween;
        val += lineValue;
        //val += 100 * Math.exp(-0.03 * (refTime - b.timestamp));
    });
    return val / file.blameData.length
}

export function getOwnership(file: FileBlame) {
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

export function parseFile(filePath: string) {
    try {
        const file = fs.readFileSync(path.join(REPO_DIR, filePath + ".adat")).toString('utf-8')
        let lines: string[] = file.trim().split('\n');
        const blameData: BlameData[] = lines.map((l: string) => {
            let tokens = l.match(/\S+/g) as string[];
            const commitHash = tokens[0];
            const author = tokens[1];
            const timestamp = parseInt(tokens[2], 10);
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