"use strict";
/**
 * File to calculate repo freshness.
 */
exports.__esModule = true;
// TODO !!!: remove logging 
var ShellCommander_1 = require("./ShellCommander");
var Parser_1 = require("./Parser");
var CLONE_DIR = '../resources/clone';
var RESOURCE_DIR = '../resources';
var CODE_DIR = '../resources/clone/fresh-code'; // TODO remove this
var repoName = "";
/**
 * Calculates freshness for each file in the repo and returns a
 * chart data node corresponding to the repo.
 *
 * @param repolink repolink to a public github repository
 */
function calculateFreshness(repolink) {
    // TODO
}
/**
 * Clones the while github repository under src/resources/clone.
 *
 * @param repolink github repository link
 */
function cloneRepo(repolink) {
    ShellCommander_1.runShellCommand('mkdir clone', RESOURCE_DIR);
    ShellCommander_1.runShellCommand('git clone ' + repolink, CLONE_DIR);
    var repoName = ShellCommander_1.runShellCommand('ls', CLONE_DIR);
    console.log('repo cloned: ' + repoName);
    return repoName;
}
/**
 * Removes the clone directory.
 */
function removeClone(repoPath) {
    console.log("removing", repoPath);
    // runShellCommand('rm -r ', repoPath);
}
exports.removeClone = removeClone;
/**
 * Returns the array of file paths returned from git ls-files on
 * the clone repository.
 *
 * @param repoPath name of the repository in src/resources/clone
 */
function getRepoFiles(repoPath) {
    var cwd = repoPath;
    // console.log('running git ls-files on:  ' + cwd);
    var filesNamesString = ShellCommander_1.runShellCommand('git ls-files', repoPath);
    var fileNamesArray = ShellCommander_1.formatOutputNewLine(filesNamesString);
    return fileNamesArray;
}
exports.getRepoFiles = getRepoFiles;
/**
 * Builds and returns an object representing whole directory as a tree
 * Uses DirectoryNode interface for the nodes of the tree.
 *
 * @param filePathsArray array of file paths from git ls-files
 * @param rootNodeName name of the repository
 */
function buildDirectoryTree(filePathsArray, rootNodeName) {
    // console.log('building directory tree');
    var root = createNode(rootNodeName, "", {}, [], 0);
    for (var _i = 0, filePathsArray_1 = filePathsArray; _i < filePathsArray_1.length; _i++) {
        var filePath = filePathsArray_1[_i];
        insertNode("", filePath, root, true);
    }
    console.log('____tree is done___');
    return root;
}
exports.buildDirectoryTree = buildDirectoryTree;
/**
 * Creates(if not exists) and inserts a node on the directory tree.
 *
 * @param currentPath path seen so far e.g. "src"
 * @param remainingPath remaining path to go e.g. "resources/components/Chart.tsx"
 * @param parent parent Node
 * @param firstLevel true if this is called on the root
 */
function insertNode(currentPath, remainingPath, parent, firstLevel) {
    var remainingDirectories = remainingPath.split('/');
    var nodeName = remainingDirectories[0];
    var newPath = firstLevel ? nodeName : (currentPath + '/' + nodeName);
    // console.log('=== inserting: '+ nodeName);
    if (remainingDirectories.length === 1) { // actual file to insert
        // console.log('last item');
        var node = createNode(nodeName, newPath, parent, [], 0);
        parent.children.push(node);
        return;
    }
    else {
        // path consists of multiple directories and a file
        // console.log('not last item')
        var node = findAndGetChild(nodeName, parent);
        remainingDirectories.shift();
        var pathToGo = remainingDirectories.join('/');
        if (node) {
            // directory already exists
            insertNode(newPath, pathToGo, node, false);
            return;
        }
        else {
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
function createNode(name, path, parent, children, freshnessScore) {
    return {
        name: name,
        path: path,
        parent: parent,
        children: children,
        freshnessScore: freshnessScore
    };
}
/**
 * Finds and returns the child DirectoryNode with a same name;
 * returns null if a child with the same name does not exist.
 *
 * @param childName name of the file
 * @param parent parent DirectoryNode
 */
function findAndGetChild(childName, parent) {
    for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
        var child = _a[_i];
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
 */
function printDirectory(root, tabs) {
    if (root.children.length === 0) {
        console.log("\t".repeat(tabs) + root.path + ' ' + root.freshnessScore);
    }
    else {
        for (var _i = 0, _a = root.children; _i < _a.length; _i++) {
            var child = _a[_i];
            printDirectory(child, tabs + 1);
        }
    }
}
exports.printDirectory = printDirectory;
/**
 * Calculates the freshness score of the whole tree.
 *
 * @param root root of the tree to start calculating freshness
 */
function calculateFreshnessForFiles(root) {
    if (root.children.length === 0) {
        // LEAF so calculate freshness
        var score = getFreshness(root.name, root.path);
        root.freshnessScore = score;
        return score;
    }
    else {
        var totalScore = 0;
        var numChildren = root.children.length;
        for (var _i = 0, _a = root.children; _i < _a.length; _i++) {
            var child = _a[_i];
            totalScore += calculateFreshnessForFiles(child);
        }
        return Math.ceil(totalScore / numChildren);
    }
}
exports.calculateFreshnessForFiles = calculateFreshnessForFiles;
/**
 * Calculates and returns the freshness of a single file.
 *
 * @param fileName path the to file from the clone repo
 * e.g. src/resources/SampleChartInput.ts
 */
function getFreshness(fileName, filePath) {
    var blameString = 'git blame -t -C -M -- ' + filePath
        + '  > "' + fileName + '.adat"';
    ShellCommander_1.runShellCommand(blameString, CODE_DIR);
    var blameFile = Parser_1.parseFile(fileName);
    var now = Date.now();
    console.log('now: ' + now);
    var freshness = Parser_1.calculateFreshnessScore(blameFile, now / 1000); // get UTC seconds by /1000 
    console.log('freshness for ' + fileName + ' is : ' + freshness);
    ShellCommander_1.runShellCommand('rm ' + fileName + '.adat', CODE_DIR);
    // TODO: write git blame output into a file
    // TODO: and calculate the freshness from that output file
    // TODO: remove the file
    //runShellCommand('git blame -t -- ' + fileName, CLONE_DIR + '/' + repoName);
    return Math.ceil(freshness);
}
//repoName = cloneRepo('https://github.com/guilhermelameira/fresh-code.git');
var root = buildDirectoryTree(getRepoFiles(CODE_DIR), "");
//printDirectory(root, 0);
calculateFreshnessForFiles(root);
printDirectory(root, 0);
//getFreshness('.gitignore', '.gitignore');
//removeClone();
