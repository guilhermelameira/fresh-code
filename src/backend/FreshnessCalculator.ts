/**
 * File to calculate repo freshness.
 */

 // TODO: remove logging
import { formatOutputNewLine, runShellCommand } from './ShellCommander';
import { DirectoryNode } from '../types/BackendTypes';
const CLONE_DIR = '../resources/clone';
const RESOURCE_DIR = '../resources';

/**
 * Calculates freshness for each file in the repo and returns a
 * chart data node corresponding to the repo
 * @param repolink repolink to a public github repository
 */
function calculateFreshness(repolink: string){
    // TODO
// clone the repo
// get all files
//// for each file
//// calculate freshness 

// produce output
//remove the clone
}


/**
 * Clones the while github repository under src/resources/clone
 * @param repolink github repository link
 */
function cloneRepo(repolink: string): string{
    runShellCommand('mkdir clone', RESOURCE_DIR);
    runShellCommand('git clone ' + repolink, CLONE_DIR);
    let repoCloneOutput = runShellCommand('ls', CLONE_DIR);
    console.log('printinng repo: ' + repoCloneOutput);
    return repoCloneOutput;
}

function removeClone(){
    runShellCommand('rm -r clone', RESOURCE_DIR);
}

function getRepoFiles(repositoryName: string): string[]{
    let cwd = CLONE_DIR + '/' + repositoryName;
    console.log('running git ls-files on:  ' + cwd);
    let filesNamesString = runShellCommand('git ls-files', CLONE_DIR + '/' + repositoryName);
    let fileNamesArray = formatOutputNewLine(filesNamesString);
    return fileNamesArray;
}

function buildDirectoryTree(filePathsArray: string[], rootNodeName: string){
    console.log('building directory tree');
    let root = createNode(rootNodeName, "", {} as DirectoryNode, [], 0);
    for(let filePath of filePathsArray){
        insertNode("", filePath, root);
    }
    console.log('____tree is done___');
    printDirectory(root, "");
}

function insertNode(currentPath: string, remainingPath: string, parent: DirectoryNode){
    let remainingDirectories = remainingPath.split('/');
    let nodeName = remainingDirectories[0];
    let newPath = currentPath + '/' + nodeName;
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
            insertNode(newPath, pathToGo, node);
            return;
        } else {
            // create the directory and insert on it
            node = createNode(nodeName, newPath, parent, [], 0);
            parent.children.push(node);
            insertNode(newPath, pathToGo, node);
            return;
        }
    }
}

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

function findAndGetChild(childName: string, parent:DirectoryNode){
    for(let child of parent.children){
        if(child.name === childName){
            return child;
        }
    }
    return null;
}

function printDirectory(root: DirectoryNode, currentPath: string){
    if(root.children.length === 0){
        console.log(currentPath + '/' + root.name);
    } else {
        for(let child of root.children){
            printDirectory(child, currentPath + '/' +root.name);
        }
    }
}




export { calculateFreshness };

//cloneRepo('https://github.com/guilhermelameira/fresh-code.git');
//removeClone();
//let filesArray = getRepoFiles('fresh-code');
//buildDirectoryTree(filesArray, 'fresh-code');

