"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
//import {REPO_DIR} from "../Main"; // TODO
var REPO_DIR = '../resources/clone/fresh-code';
function f(root) {
}
// note: very qualitative...
function calculateFreshnessScore(file, refTime) {
    var val = 0.0;
    var dayCalculationDivisor = 60 * 60 * 24;
    file.blameData.forEach(function (b) {
        var dayBetween = (refTime - b.timestamp) / dayCalculationDivisor;
        // TODO fix
        //console.log(Math.exp(-0.03 * (refTime - b.timestamp)))
        //val += 100 * Math.exp(-0.03 * (refTime - b.timestamp));
        //console.log(( refTime - b.timestamp)/ dayCalculationDivisor )
        var lineValue = dayBetween > 150 ? 150 : dayBetween;
        val += lineValue;
        //val += 100 * Math.exp(-0.03 * (refTime - b.timestamp));
    });
    return val / file.blameData.length;
}
exports.calculateFreshnessScore = calculateFreshnessScore;
function getOwnership(file) {
    var val = new Map();
    file.blameData.forEach(function (b) {
        var cur = val.get(b.author) || 0;
        val.set(b.author, cur + (100 * Math.exp(-0.03 * b.timestamp)));
    });
    val.forEach(function (value, key) {
        val.set(key, value / file.blameData.length);
    });
    return val;
}
exports.getOwnership = getOwnership;
function parseFile(filePath) {
    try {
        var file = fs.readFileSync(path.join(REPO_DIR, filePath + ".adat")).toString('utf-8');
        var lines = file.trim().split('\n');
        var blameData = lines.map(function (l) {
            var tokens = l.match(/\S+/g);
            var commitHash = tokens[0];
            var author = tokens[1];
            var timestamp = parseInt(tokens[2], 10);
            return {
                commitHash: commitHash,
                author: author,
                timestamp: timestamp
            };
        });
        return {
            filePath: filePath,
            blameData: blameData
        };
    }
    catch (err) {
        console.log("Failed to open file", err);
        return {};
    }
}
exports.parseFile = parseFile;
