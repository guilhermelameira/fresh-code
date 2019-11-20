/**
 * File for executing shell commands and getting formatted outputs.
 */

import {execSync} from 'child_process';

/**
 * Executes a shell command. Returns the error when 
 * an error occurs, otherwise the output
 * @param commandString command string to run on terminal
 * @param cwd directory to run commands
 */
function runShellCommand(commandString: string, cwd: string): string {
    let result =  execSync(commandString, {cwd: cwd});
    let stringResult = "";
    if(result instanceof Buffer){
        stringResult = result.toString();
    } else {
        stringResult = result;
    }
    console.log(commandString + ' in ' + cwd + ' result:');
    // console.log(stringResult);
    return stringResult;
}

/**
 * Returns an array of strings in which each element corresponds
 * to a string divided by a new line
 * @param output output string from a shell command execution
 */
function formatOutputNewLine(output: string): string[] {
    let resultArray = output.split('\n');
    resultArray.pop();
    return resultArray;
}


export {formatOutputNewLine, runShellCommand};
