import {
    buildDirectoryTree,
    calculateFreshnessForFiles, generateGraphData,
    getRepoFiles,
    printDirectory
} from "./backend/FreshnessCalculator";
import * as fs from "fs";
import * as path from "path";
import {getFreshness, getOwnership, parseFile} from "./backend/Parser";

export const PROJECT_ROOT_PATH = path.join(__dirname, "..");
export const REPO_DIR = path.join(PROJECT_ROOT_PATH, "repo");

class Main {
    public main() {
        // For now clone a repo into the root project folder with the folder name repo
        // `git clone <link> repo` in project root folder
        //  `git ls-files | xargs -I{} sh -c 'git blame -t -C -M -f -e -w -- $1 > "$1.adat"' -- {}` will generate the git blame files

        //repoName = cloneRepo('https://github.com/guilhermelameira/fresh-code.git');
        let files = getRepoFiles(REPO_DIR);
        let root = buildDirectoryTree(files, "");
        // calculateFreshnessForFiles(root, 1571768680);
        // let graph = generateGraphData(root);
        // console.log(graph);
        // this.writeToFile(graph);
        //removeClone();

        let ownership = getOwnership(parseFile("package.json"), 1571768680);
        console.log(ownership)
        ownership = getOwnership(parseFile("src/parser/RichTextParser.ts"), 1571768680);
        console.log(ownership)

    }

    public writeToFile(obj: any) {
        fs.writeFile(path.join(PROJECT_ROOT_PATH, "src/resources/data.json"), JSON.stringify(obj), 'utf8', (err) => {
            console.log(err)
        });
    }
}

let m = new Main();
m.main();