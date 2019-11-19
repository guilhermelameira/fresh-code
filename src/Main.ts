import {buildDirectoryTree, getRepoFiles, printDirectory, removeClone} from "./backend/FreshnessCalculator";
import {runShellCommand} from "./backend/ShellCommander";
import * as path from "path";
import {getFreshness, parseFile} from "./backend/Parser";

export const ROOT_DIR = path.join(__dirname, "..");
export const REPO_DIR = path.join(ROOT_DIR, "repo");

class Main {
    public main() {
        // For now clone a repo into the root project folder with the folder name repo
        // `git clone <link> repo` in project root folder
        //  `git ls-files | xargs -I{} sh -c 'git blame -t -C -M -- $1 > "$1.adat"' -- {}` will generate the git blame files
        // let files = getRepoFiles(REPO_DIR);
        // console.log(files)
        // let root = buildDirectoryTree(files, "");
        let readme = parseFile("README.md");
        let freshness = getFreshness(readme, 1573603200);
        console.log('freshness', freshness)
        // printDirectory(root, 0);
        // console.log(root)
    }
}

let m = new Main();
m.main();