import {
    buildDirectoryTree,
    calculateFreshnessForFiles, generateGraphData,
    getRepoFiles,
    printDirectory
} from "./backend/FreshnessCalculator";
import * as fs from "fs";
import * as path from "path";
import {getFreshness, getOwnership, parseFile} from "./backend/Parser";
import {runShellCommand} from "./backend/ShellCommander";

export const PROJECT_ROOT_PATH = path.join(__dirname, "..");
export const REPO_DIR = path.join(PROJECT_ROOT_PATH, "repo");
const REPO_LINK = "https://github.com/jquery/jquery";

class Main {
    public main() {
        // For now clone a repo into the root project folder with the folder name repo
        // `git clone <link> repo` in project root folder
        runShellCommand(`rm -rf repo`, PROJECT_ROOT_PATH);
        runShellCommand(`git clone ${REPO_LINK} repo`, PROJECT_ROOT_PATH);
        //  `git ls-files | xargs -I{} sh -c 'git blame -t -C -M -f -e -w -- $1 > "$1.adat"' -- {}` will generate the git blame files
        runShellCommand(`git ls-files | xargs -I{} sh -c 'git blame -t -C -M -f -e -w -- $1 > "$1.adat"' -- {}`, REPO_DIR)

        //repoName = cloneRepo('https://github.com/guilhermelameira/fresh-code.git');
        // git log --pretty=format:%ct | tail -1 [First time]
        // git log --pretty=format:%ct | head -1 [Latest time]
        const firstTimestampStr = runShellCommand("git log --pretty=format:%ct | tail -1", REPO_DIR);
        const latestTimestampStr = runShellCommand("git log --pretty=format:%ct | head -1", REPO_DIR);
        const firstTimestamp = parseInt(firstTimestampStr);
        const latestTimestamp = parseInt(latestTimestampStr);
        let files = getRepoFiles(REPO_DIR);
        let root = buildDirectoryTree(files, "repo");
        calculateFreshnessForFiles(root, latestTimestamp);
        let graph = generateGraphData(root);
        this.writeToFile(graph);
    }

    public writeToFile(obj: any) {
        fs.writeFile(path.join(PROJECT_ROOT_PATH, "src/resources/data.json"), JSON.stringify(obj), 'utf8', (err) => {
            console.log(err)
        });
    }
}

let m = new Main();
m.main();