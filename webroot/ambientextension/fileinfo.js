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

async function fileinfo(uri) {
    try {
        // Read the file using VS Code API
        const fileContent = await readFile(uri)
        const lines = fileContent.split("\n");

        let classes = [];
        let currentClass = null;
        let insideClass = false;

        const classRegex = /_.define(?:\.(\w+))?\.(\w+)\("([^"]+)",/;
        const methodRegex = /\s*([\w$]+)\s*:\s*function\s*\(/;
        const functionRegex = /_.(\w+)\s*=\s*function\s*\(/;

        lines.forEach((line, index) => {
            let classMatch = line.match(classRegex);
            let methodMatch = line.match(methodRegex);

            if (classMatch) {
                // Start a new class object
                switch (classMatch[1]) {
                    case "enum":
                        insideClass = false;
                        break

                    default:
                        if (currentClass) classes.push(currentClass);

                        currentClass = {
                            name: classMatch[3], // Extract class name
                            type: "object",
                            linenum: index + 1,
                            methods: [],
                        };
                        insideClass = true;
                    }
//            } else if (methodMatch && insideClass && currentClass) {

            } else if (methodMatch) {
                // Extract method names inside the current class
                currentClass.methods.push({
                    name: methodMatch[1], // Extract method name
                    linenum: index + 1,
                });


            // } else if (insideClass && line.includes("}")) {
            //     // Close the class definition
            //     insideClass = false;
            } else if (functionRegex) {                
                if (!insideClass) {

                }
            }                

        });

        // Push last found class
        if (currentClass) classes.push(currentClass);

        return classes;
    } catch (err) {
        console.error("Error reading file:", err);
        return [];
    }
}

module.exports = { fileinfo };