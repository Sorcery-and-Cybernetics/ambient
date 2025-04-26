const vscode = require("vscode");

function normalizePath(filePath) {
    return filePath.replace(/\\/g, "/");  // Convert Windows backslashes to forward slashes
}

async function readFile(filePath) {
    try {
        const normalizedPath = normalizePath(filePath);  // Fix slashes
        const uri = vscode.Uri.file(normalizedPath);  // Create a VS Code URI

        // Read file as Uint8Array
        const fileData = await vscode.workspace.fs.readFile(uri);

        // Convert Uint8Array to UTF-8 string
        return Buffer.from(fileData).toString("utf8");
    } catch (error) {
        console.error("Error reading file:", error);
        vscode.window.showErrorMessage("Error reading file: " + error.message);
        return null;
    }
}

/**
Analyze javascript file, and return a nested json structure that can later be used to draw in the tree
A file module in our system has a proprieteray module definition. 
Each file contains at least a module name, and can have one or more classes or other definitions, such as global functions or enums. 
Each object has a name, and a list of traits and methods. Each trait and method has a name and a line number. 
A trait is a special type of method. Without a given argument it will return a value, with a given argument it will set a value and return this.
Objects can have behaviors. A behavior is a group of methods. A behavior can have one or more methods.
The line number is used to navigate to the method in the code. 
A module can also have global functions.
Following are the rules. Variable names are given between brackets { }. Optional parts are given between square brackets [ ].
Module definition is as: _.ambient.module("{modulename}", function(_) { 
Object definition is as: _.define.{superclassname}("{classname}", function([supermodel]) { 
Trait definition is as: this.{traitname} = _.{typename}([initial])
Method definition is as: this.{methodname} = function([arguments]) {
Behavior definition is as: this.{behaviorname} = _.behavior(function([superbehavior]) {
Global function definition is as: _.{functionname} =  or as this.{functionname} = 
Enum definition is as _.define.enum("{enumname}", [items], [offset])

Example return value:
[
  {
    name: "MyModule",
    type: "module",
    linenum: 1,
    scope: [
      {
        name: "MyClass",
        type: "object",
        linenum: 3,
        scope: [
            { name: "trait1", 
                linenum: 5,
                type: "trait" },
            { name: "method1", 
              linenum: 5,
              type: "method" },
          { name: "behaviorMethod1",
            linenum: 17, 
            type: "behavior",
            scope: [
              { name: "behaviorMethod1", 
                linenum: 17,
                type: "method" },
              { name: "behaviorMethod2", 
                linenum: 22,
                type: "method" }
            ]
          }]
      },
      { name: "globalFunction1", 
        linenum: 30,
        type: "function" },
      { name: "globalFunction2", 
        linenum: 35,
        type: "function" }
    ]
  }
]

Extra requirements
Not all javascript files follow this definition. A javascript file that does not follow this definition should not be analyzed.
Brackets should be counted in the file, to be sure the nesting is handled correctly.
**/

async function fileinfo(filePath) {
    const fileContent = await readFile(filePath);
    if (!fileContent) return null;

    const lines = fileContent.split('\n');
    let result = [];
    let currentModule = null;
    let currentObject = null;
    let currentBehavior = null;
    let currentMethod = null;
    let bracketCount = 0;
    let methodStartBracketCount = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Count brackets
        const openBrackets = (line.match(/{/g) || []).length;
        const closeBrackets = (line.match(/}/g) || []).length;
        bracketCount += openBrackets - closeBrackets;

        // Module start
        if (line.startsWith('_.ambient.module(')) {
            const moduleName = line.match(/"([^"]+)"/)[1];
            currentModule = { name: moduleName, type: 'module', linenum: i + 1, scope: [] };
            result.push(currentModule);
            continue;
        }

        if (!currentModule) continue;

        if (currentMethod) {
            // Check if method is closed
            if (bracketCount === methodStartBracketCount) {
                currentMethod = null;
                methodStartBracketCount = 0;
            }
            continue;
        }


        // Behavior definition
        if (line.startsWith('this.') && line.includes('_.behavior(')) {
            const match = line.match(/this\.(\w+)\s*=/);
            if (match) {
                currentBehavior = { name: match[1], type: 'behavior', linenum: i + 1, scope: [] };
                if (currentObject) {
                    currentObject.scope.push(currentBehavior);
                }
            }
        }        

        // Method definition
        else if (line.startsWith('this.') && line.includes('=') && (line.includes('function(') || line.includes('function ('))) {
            const match = line.match(/this\.([\w\.]+\$?)\s*=/);
            if (match) {
                const item = { name: match[1], type: 'method', linenum: i + 1 };
                if (currentBehavior) {
                    currentBehavior.scope.push(item);
                } else if (currentObject) {
                    currentObject.scope.push(item);
                } else if (currentModule) {
                    item.type = 'function';
                    currentModule.scope.push(item);
                }
                
                // Only set currentMethod if this is a multiline method
                if (openBrackets > closeBrackets) {
                    currentMethod = item;
                    methodStartBracketCount = bracketCount - openBrackets;
                }
                continue;
            }
        }

        // Enum definition
        if (line.startsWith('_.define.enum(')) {
            const match = line.match(/_.define\.enum\("([^"]+)"/);
            if (match) {
                currentModule.scope.push({ name: match[1], type: 'enum', linenum: i + 1 });
            }
        }

        // Object definition
        else if (line.startsWith('_.define.')) {
            const match = line.match(/_.define\.([\w\.]+)\("([^"]+)"/);
            if (match) {
                currentObject = { name: match[2], type: 'object', linenum: i + 1, scope: [] };
                currentModule.scope.push(currentObject);
            }
        } 
        // Trait definition
        else if (line.startsWith('this.') && line.includes('=') && line.includes('_.')) {
            const traitMatch = line.match(/this\.([\w\.]+\$?)\s*=\s*_\.(\w+)(\(.*\))?/);
            if (traitMatch && traitMatch[2] !== 'behavior') {
                const traitItem = { 
                    name: traitMatch[1], 
                    type: 'trait', 
                    linenum: i + 1, 
                    typename: traitMatch[2] 
                };
                
                if (traitMatch[2] === 'enum') {
                    traitItem.type = 'enum';
                } else if (traitMatch[2] === 'make' && line.includes('_.make.core.basicsignal')) {
                    traitItem.type = 'eventhandler';
                } else if (traitMatch[2] === 'make' && line.includes('_.make.core.signal')) {
                    traitItem.type = 'eventhandler';
                }

                if (currentBehavior) {
                    currentBehavior.scope.push(traitItem);
                } else if (currentObject) {
                    currentObject.scope.push(traitItem);
                }
            }
        }
        // Global function definition
        else if (line.startsWith('_.') && line.includes('=')) {
            const match = line.match(/_\.([\w\.]+\$?)\s*=/);
            if (match && !line.startsWith('_.ambient.module')) {
                currentModule.scope.push({ 
                    name: match[1], 
                    type: 'function', 
                    linenum: i + 1 
                });
            }
        }

        // Check for scope ends
        if (bracketCount === 0 && currentModule) {
            if (line.includes('})') || line === '}') {
                if (currentBehavior) {
                    currentBehavior = null;
                } else if (currentObject) {
                    currentObject = null;
                } else if (currentModule) {
                    currentModule = null;
                }
            }
        }
    }

    return result.length > 0 ? result : null;
}

module.exports = { fileinfo };
