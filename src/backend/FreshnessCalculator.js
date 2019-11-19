"use strict";
/**
 * File to calculate repo freshness.
 */
exports.__esModule = true;
// TODO: remove logging
var ShellCommander_1 = require("./ShellCommander");
var CLONE_DIR = '../resources/clone';
var RESOURCE_DIR = '../resources';
/**
 * Calculates freshness for each file in the repo and returns a
 * chart data node corresponding to the repo
 * @param repolink repolink to a public github repository
 */
function calculateFreshness(repolink) {
    // TODO
    // clone the repo
    // get all files
    //// for each file
    //// calculate freshness 
    // produce output
    //remove the clone
}
exports.calculateFreshness = calculateFreshness;
/**
 * Clones the while github repository under src/resources/clone
 * @param repolink github repository link
 */
function cloneRepo(repolink) {
    ShellCommander_1.runShellCommand('mkdir clone', RESOURCE_DIR);
    ShellCommander_1.runShellCommand('git clone ' + repolink, CLONE_DIR);
    var repoCloneOutput = ShellCommander_1.runShellCommand('ls', CLONE_DIR);
    console.log('printinng repo: ' + repoCloneOutput);
    return repoCloneOutput;
}
function removeClone() {
    ShellCommander_1.runShellCommand('rm -r clone', RESOURCE_DIR);
}
function getRepoFiles(repositoryName) {
    var cwd = CLONE_DIR + '/' + repositoryName;
    console.log('running git ls-files on:  ' + cwd);
    var filesNamesString = ShellCommander_1.runShellCommand('git ls-files', CLONE_DIR + '/' + repositoryName);
    var fileNamesArray = ShellCommander_1.formatOutputNewLine(filesNamesString);
    return fileNamesArray;
}
function buildDirectoryTree(filePathsArray, rootNodeName) {
    console.log('building directory tree');
    var root = createNode(rootNodeName, "", {}, [], 0);
    for (var _i = 0, filePathsArray_1 = filePathsArray; _i < filePathsArray_1.length; _i++) {
        var filePath = filePathsArray_1[_i];
        insertNode("", filePath, root);
    }
    console.log('____tree is done___');
    printDirectory(root, "");
}
function insertNode(currentPath, remainingPath, parent) {
    var remainingDirectories = remainingPath.split('/');
    var nodeName = remainingDirectories[0];
    var newPath = currentPath + '/' + nodeName;
    console.log('=== inserting: ' + nodeName);
    if (remainingDirectories.length === 1) { // actual file to insert
        console.log('last item');
        var node = createNode(nodeName, newPath, parent, [], 0);
        parent.children.push(node);
        return;
    }
    else {
        // path consists of multiple directories and a file
        console.log('not last item');
        var node = findAndGetChild(nodeName, parent);
        remainingDirectories.shift();
        var pathToGo = remainingDirectories.join('/');
        if (node) {
            // directory already exists
            insertNode(newPath, pathToGo, node);
            return;
        }
        else {
            // create the directory and insert on it
            node = createNode(nodeName, newPath, parent, [], 0);
            parent.children.push(node);
            insertNode(newPath, pathToGo, node);
            return;
        }
    }
}
function createNode(name, path, parent, children, freshnessScore) {
    return {
        name: name,
        path: path,
        parent: parent,
        children: children,
        freshnessScore: freshnessScore
    };
}
function findAndGetChild(childName, parent) {
    for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
        var child = _a[_i];
        if (child.name === childName) {
            return child;
        }
    }
    return null;
}
function printDirectory(root, currentPath) {
    if (root.children.length === 0) {
        console.log(currentPath + '/' + root.name);
    }
    else {
        for (var _i = 0, _a = root.children; _i < _a.length; _i++) {
            var child = _a[_i];
            printDirectory(child, currentPath + '/' + root.name);
        }
    }
}
//cloneRepo('https://github.com/guilhermelameira/fresh-code.git');
//console.log('cloned');
removeClone();
//let filesArray = getRepoFiles('fresh-code');
//buildDirectoryTree(filesArray, 'fresh-code');
