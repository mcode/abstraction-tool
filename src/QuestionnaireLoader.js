"use strict";
exports.__esModule = true;
exports.QuestionnaireLoader = void 0;
var fs = require("fs");
var QuestionnaireLoader = /** @class */ (function () {
    function QuestionnaireLoader() {
    }
    QuestionnaireLoader.prototype.getFromFile = function (filePath) {
        // use fs to read in file content as JSON
        var obj = {};
        console.log("hi");
        var json = fs.readFileSync(filePath, 'utf8');
        obj = JSON.parse(json);
        console.log(obj);
        return obj;
        // if (!json): 
        //   console.log("This is undefined or null.");
        //   return null;
        // else:
        //   obj = JSON.parse(json);
        //   return obj;
    };
    return QuestionnaireLoader;
}());
exports.QuestionnaireLoader = QuestionnaireLoader;
var QuestionnaireLoader1 = new QuestionnaireLoader();
QuestionnaireLoader1.getFromFile('./Questionnaires/sample_questionnaire.json');
// QuestionnaireLoader1.getFromUrl('url');
