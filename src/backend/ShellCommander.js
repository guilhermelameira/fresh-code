"use strict";
/**
 * File for executing shell commands and getting formatted outputs.
 */
exports.__esModule = true;
var child_process_1 = require("child_process");
/**
 * Executes a shell command. Returns the error when
 * an error occurs, otherwise the output.
 *
 * @param commandString command string to run on terminal
 * @param cwd directory to run commands
 */
function runShellCommand(commandString, cwd) {
    var result = child_process_1.execSync(commandString, { cwd: cwd });
    var stringResult = "";
    if (result instanceof Buffer) {
        stringResult = result.toString();
    }
    else {
        stringResult = result;
    }
    console.log(commandString + ' in ' + cwd + ' result:');
    // console.log(stringResult);
    return stringResult;
}
exports.runShellCommand = runShellCommand;
/**
 * Returns an array of strings in which each element corresponds
 * to a string divided by a new line.
 *
 * @param output output string from a shell command execution
 */
function formatOutputNewLine(output) {
    var resultArray = output.split('\n');
    resultArray.pop();
    return resultArray;
}
exports.formatOutputNewLine = formatOutputNewLine;
