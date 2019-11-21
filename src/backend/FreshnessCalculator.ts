/**
 * File to calculate repo freshness.
 */

// TODO !!!: remove logging


import {formatOutputNewLine, runShellCommand} from './ShellCommander';
import {DirectoryNode} from '../types/BackendTypes';
import {ChartDataBranch, ChartDataLeaf, ChartDataNode} from "../types/ChartTypes";
import {FILE_ICON, FOLDER_ICON} from "../resources/SampleChartInput";
import {getFreshness, getOwnership, parseFile} from "./Parser";

const CLONE_DIR = '../resources/clone';
const RESOURCE_DIR = '../resources';
const CODE_DIR = '../resources/clone/fresh-code'; // TODO remove this
let repoName = "";

/**
 * Clones the while github repository under src/resources/clone.
 *
 * @param repolink github repository link
 */
function cloneRepo(repolink: string): string {
    runShellCommand('mkdir clone', RESOURCE_DIR);
    runShellCommand('git clone ' + repolink, CLONE_DIR);
    let repoName = runShellCommand('ls', CLONE_DIR);
    console.log('repo cloned: ' + repoName);
    return repoName;
}

/**
 * Removes the clone directory.
 */
export function removeClone(repoPath: string) {
    console.log("removing", repoPath)
    // runShellCommand('rm -r ', repoPath);
}

/**
 * Returns the array of file paths returned from git ls-files on
 * the clone repository.
 *
 * @param repoPath name of the repository in src/resources/clone
 */
function getRepoFiles(repoPath: string): string[] {
    let cwd = repoPath;
    // console.log('running git ls-files on:  ' + cwd);
    let filesNamesString = runShellCommand('git ls-files', repoPath);
    let fileNamesArray = formatOutputNewLine(filesNamesString);
    return fileNamesArray;
}

/**
 * Builds and returns an object representing whole directory as a tree
 * Uses DirectoryNode interface for the nodes of the tree.
 *
 * @param filePathsArray array of file paths from git ls-files
 * @param rootNodeName name of the repository
 */
export function buildDirectoryTree(filePathsArray: string[], rootNodeName: string) {
    // console.log('building directory tree');
    let root = createNode(rootNodeName, "", {} as DirectoryNode, [], 0);
    for (let filePath of filePathsArray) {
        insertNode("", filePath, root, true);
    }
    console.log('____tree is done___');
    return root;
}

/**
 * Creates(if not exists) and inserts a node on the directory tree.
 *
 * @param currentPath path seen so far e.g. "src"
 * @param remainingPath remaining path to go e.g. "resources/components/Chart.tsx"
 * @param parent parent Node
 * @param firstLevel true if this is called on the root
 */
function insertNode(currentPath: string, remainingPath: string, parent: DirectoryNode, firstLevel: boolean) {
    let remainingDirectories = remainingPath.split('/');
    let nodeName = remainingDirectories[0];
    let newPath = firstLevel ? nodeName : (currentPath + '/' + nodeName);
    // console.log('=== inserting: '+ nodeName);

    if (remainingDirectories.length === 1) { // actual file to insert
        // console.log('last item');
        let node = createNode(nodeName, newPath, parent, [], 0);
        parent.children.push(node);
        return;
    } else {
        // path consists of multiple directories and a file
        // console.log('not last item')
        let node = findAndGetChild(nodeName, parent);
        remainingDirectories.shift();
        let pathToGo = remainingDirectories.join('/');
        if (node) {
            // directory already exists
            insertNode(newPath, pathToGo, node, false);
            return;
        } else {
            // create the directory and insert on it
            node = createNode(nodeName, newPath, parent, [], 0);
            parent.children.push(node);
            insertNode(newPath, pathToGo, node, false);
            return;
        }
    }
}

/**
 * Creates and returns a DirectoryNode given arguments.
 *
 * @param name name of the file
 * @param path path to the file
 * @param parent parent DirectoryNode
 * @param children array of DirectoryNodes representing files inside this dir
 * @param freshnessScore number representing freshness
 */
function createNode(name: string, path: string, parent: DirectoryNode,
                    children: DirectoryNode[], freshnessScore: number) {
    return {
        name: name,
        path: path,
        parent: parent,
        children: children,
        freshnessScore: freshnessScore
    } as DirectoryNode;
}

/**
 * Finds and returns the child DirectoryNode with a same name;
 * returns null if a child with the same name does not exist.
 *
 * @param childName name of the file
 * @param parent parent DirectoryNode
 */
function findAndGetChild(childName: string, parent: DirectoryNode) {
    for (let child of parent.children) {
        if (child.name === childName) {
            return child;
        }
    }
    return null;
}

/**
 * Prints the filenames of the directory. Its results
 * must give the result of git ls-files on the same dir.
 *
 * @param root root DirectoryNode
 * @param tabs number of tabs
 */
function printDirectory(root: DirectoryNode, tabs: number) {
    if (root.children.length === 0) {
        console.log(`${"\t".repeat(tabs)}${root.path}\t${root.freshnessScore.toString(10).padStart(10)}`);
    } else {
        console.log(`${"\t".repeat(tabs)}${root.path}\t${root.freshnessScore.toString(10).padStart(10)}`);
        for (let child of root.children) {
            printDirectory(child, tabs + 1);
        }
    }
}

export function calculateFreshnessForFiles(root: DirectoryNode, refTime: number) {
    if (root.children.length === 0) {
        // LEAF so calculate freshness
        const x = parseFile(root.path);
        root.freshnessScore = getFreshness(x, refTime);
        root.ownership = getOwnership(x, refTime);
        root.lineCount = x.lineCount;
    } else {
        root.children.forEach((child) => {
            calculateFreshnessForFiles(child, refTime);
        });
        root.lineCount = root.children.map((e) => e.lineCount).reduce((a, b) => a + b, 0);
        root.freshnessScore = root.children.map((e) => e.freshnessScore).reduce((a, b) => a + b, 0) / root.children.length
    }
}

function generateOwnershipData(ownership: Map<string, [number, number]>): ChartDataLeaf[] {
    const ret = [] as ChartDataLeaf[];
    ownership.forEach((val, key) => {
        ret.push({
            name: key,
            heat: val[0],
            size: val[1],
            image: FILE_ICON,
            info: [
                {
                    name: "Lines Contributed",
                    value: val[1]
                },
                {
                    name: "Ownership",
                    value: val[0]
                }
            ]
        } as ChartDataLeaf)
    });
    return ret
}

export function generateGraphData(root: DirectoryNode): ChartDataNode {
    if (root.children.length === 0) {
        return {
            name: root.name,
            heat: root.freshnessScore,
            image: FILE_ICON,
            info: [
                {
                    name: "Path",
                    value: root.path
                },
                {
                    name: "Freshness",
                    value: root.freshnessScore
                },
                {
                    name: "Line Count",
                    value: root.lineCount
                }
            ],
            children: generateOwnershipData(root.ownership!)
        } as ChartDataBranch
    } else {
        return {
            name: root.name,
            heat: root.freshnessScore,
            info: [
                {
                    name: "File Count",
                    value: root.children.length
                },
                {
                    name: "Freshness",
                    value: root.freshnessScore
                }
            ],
            image: FOLDER_ICON,
            children: root.children.map((child) => generateGraphData(child))
        } as ChartDataBranch
    }
}

export {getRepoFiles, printDirectory};
