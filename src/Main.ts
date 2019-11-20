import {buildDirectoryTree, getRepoFiles} from "./backend/FreshnessCalculator";
import * as path from "path";
import {getFreshness, parseFile, printFreshness} from "./backend/Parser";

export const PROJECT_ROOT_PATH = path.join(__dirname, "..");
export const REPO_DIR = path.join(PROJECT_ROOT_PATH, "repo");

class Main {
    public main() {
        // For now clone a repo into the root project folder with the folder name repo
        // `git clone <link> repo` in project root folder
        //  `git ls-files | xargs -I{} sh -c 'git blame -t -C -M -e -w-- $1 > "$1.adat"' -- {}` will generate the git blame files

        let files = getRepoFiles(REPO_DIR);
        let root = buildDirectoryTree(files, "");
        printFreshness(root, 0, 1571768680)

        // let file = parseFile("src/parser/PlaintextParser.ts");
        // let freshness = getFreshness(file, 1572480000);
        // console.log('freshness', freshness)
    }
}

let m = new Main();
m.main();