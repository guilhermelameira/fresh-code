/**
 * File to calculate repo freshness.
 */

 // TODO !!!: remove logging 


import { formatOutputNewLine, runShellCommand } from './ShellCommander';
import { DirectoryNode } from '../types/BackendTypes';
const CLONE_DIR = '../resources/clone';
const RESOURCE_DIR = '../resources';
const CODE_DIR = '../resources/clone/fresh-code'; // TODO remove this

/**
 * Calculates freshness for each file in the repo and returns a
 * chart data node corresponding to the repo.
 * 
 * @param repolink repolink to a public github repository
 */
function calculateFreshness(repolink: string){
    // TODO
}


/**
 * Clones the while github repository under src/resources/clone.
 * 
 * @param repolink github repository link
 */
function cloneRepo(repolink: string): string{
    runShellCommand('mkdir clone', RESOURCE_DIR);
    runShellCommand('git clone ' + repolink, CLONE_DIR);
    let repoName = runShellCommand('ls', CLONE_DIR);
    console.log('repo cloned: ' + repoName);
    return repoName;
}

/**
 * Removes the clone directory.
 */
function removeClone(){
    runShellCommand('rm -r clone', RESOURCE_DIR);
}

/**
 * Returns the array of file paths returned from git ls-files on
 * the clone repository.
 * 
 * @param repositoryName name of the repository in src/resources/clone
 */
function getRepoFiles(repositoryName: string): string[]{
    let cwd = CLONE_DIR + '/' + repositoryName;
    console.log('running git ls-files on:  ' + cwd);
    let filesNamesString = runShellCommand('git ls-files', CLONE_DIR + '/' + repositoryName);
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
function buildDirectoryTree(filePathsArray: string[], rootNodeName: string){
    console.log('building directory tree');
    let root = createNode(rootNodeName, "", {} as DirectoryNode, [], 0);
    for(let filePath of filePathsArray){
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
function insertNode(currentPath: string, remainingPath: string, parent: DirectoryNode, firstLevel: boolean){
    let remainingDirectories = remainingPath.split('/');
    let nodeName = remainingDirectories[0];
    let newPath = firstLevel? nodeName : (currentPath + '/' + nodeName);
    console.log('=== inserting: '+ nodeName);

    if(remainingDirectories.length === 1){ // actual file to insert
        console.log('last item');
        let node = createNode(nodeName, newPath, parent, [], 0);
        parent.children.push(node);
        return;
    } else { 
        // path consists of multiple directories and a file
        console.log('not last item')
        let node = findAndGetChild(nodeName, parent);
        remainingDirectories.shift();
        let pathToGo = remainingDirectories.join('/');
        if(node){ 
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
    children: DirectoryNode[], freshnessScore: number){
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
function findAndGetChild(childName: string, parent:DirectoryNode){
    for(let child of parent.children){
        if(child.name === childName){
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
 */
function printDirectory(root: DirectoryNode){
    if(root.children.length === 0){
        console.log(root.path);
    } else {
        for(let child of root.children){
            printDirectory(child);
        }
    }
}

/**
 * Calculates the freshness score of the whole tree.
 * 
 * @param root root of the tree to start calculating freshness
 */
function calculateFreshnessForFiles(root: DirectoryNode){
    if(root.children.length === 0){
        // LEAF so calculate freshness
        root.freshnessScore = getFreshness(root.path);
    } else {
        for(let child of root.children){
            calculateFreshnessForFiles(child);
        }
    }
}

/**
 * Calculates and returns the freshness of a single file.
 * 
 * @param filePath path the to file from the clone repo
 * e.g. src/resources/SampleChartInput.ts
 */
function getFreshness(filePath: string): number {
    // TODO: write git blame output into a file
    // TODO: and calculate the freshness from that output file
    // TODO: remove the file
    return 0;
}

export { calculateFreshness };

//let repo = cloneRepo('https://github.com/guilhermelameira/fresh-code.git');
//let root = buildDirectoryTree(getRepoFiles('fresh-code'), "");
//printDirectory(root);
//removeClone();
