import fs from "fs";
import xml2js from "xml2js";
import uuidv1 from "uuid/v1";

const parser = new xml2js.Parser({ cdata: true });


function xmlToJson(inFile) {
    const promise = new Promise((ressolve) => {
        fs.readFile(inFile, function (err, data) {

            parser.parseString(data, function (err, result) {
                ressolve(result);
            });
        });

    });

    return promise;
}

function jsonToXml(json) {
    const builder = new xml2js.Builder({ cdata: true });
    return builder.buildObject(json);
}

function writeFile(file, data) {
    fs.writeFile(file, data, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("WRRITEN: ", file);
    });
}


function assignUUIDToInData(inData) {

    for (const node of inData.nodes.node) {
        const id = uuidv1();
        if (!node["$"]) {
            node["$"] = {}
        }

        if (!node["$"].id) {
            node["$"].id = id;
        }

        if (!node["$"].complex) {
            node["$"].complex = 1;
        }
    }
}

function getAttributes(node) {
    if (node && node.$) {
        return node.$;
    }

    return {};
}

function getBody(node) {
    return node._;
}

function processWords(node) {
    const jsonWords = [];
    const words = node.nodes.node;
    for (const word of words) {
        const wordBody = getBody(word);
        const wordAtt = getAttributes(word);
        const title = wordBody.match(/``.*``/)[0].replace(/``/g, "");
        const ans = wordBody.match(/__.*/)[0].replace(/__/g, "");
        const examples = [];
        const tokens = wordBody.match(/--.*\n/ig);

        for (const token of tokens) {
            examples.push((token.replace(/--/ig, "").replace(/\n/ig, "")));
        }


        const jsonWord = {
            title,
            ans,
            examples,
            ...wordAtt
        }

        jsonWords.push(jsonWord);
    }
    return jsonWords;
}

function formatQnA(node) {
    const questions = [];
    const qs = node.nodes.node;
    for (const q of qs) {
        const qBody = getBody(q);
        const att = getAttributes(q);
        const title = qBody.match(/``(.|\n)*``/ig)[0].replace(/``/g, "").replace(/\n/ig, "").replace(/\s{2}/g, '');
        const answers = [];
        const tokens = qBody.match(/--.*\n/ig);

        for (const token of tokens) {
            const line = token.replace(/--/ig, "").replace(/\n/ig, "");
            if (line.startsWith(":")) {
                answers.push({
                    line: line.substr(1),
                    isTrue: true
                });
            } else {
                answers.push({
                    line
                });
            }
        }

        const question = {
            title,
            answers,
            ...att
        }

        questions.push(question);
    }
    return questions;
}


async function main(type) {
    try {
        let jsonData;
        const filePath = `${__dirname}/../data/${type}.xml`;
        const inData = await xmlToJson(filePath);
        assignUUIDToInData(inData);

        const nodesAttributes = getAttributes(inData.nodes);

        if (nodesAttributes.format === "words") {
            jsonData = processWords(inData);
        } else if (nodesAttributes.format === "grammer") {
            jsonData = formatQnA(inData);
        }

        writeFile(`${__dirname}/../public/data/${type}.json`, JSON.stringify(jsonData));
        writeFile(filePath, jsonToXml(inData));
    } catch (error) {

        console.log("*******ERROR******");
        console.error(error);
    }
}

console.log("***PROCESS START***");
const type = process.argv[2];
main(type);
console.log("processing: ", type);
