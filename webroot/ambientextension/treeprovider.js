const vscode = require("vscode");
const { fileinfo } = require("./fileinfo");

// --- FILE HISTORY PANEL ---
class FileHistoryProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.fileHistory = [];
        this.MAX_HISTORY = 50;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    addFile(filePath) {
        if (!filePath.startsWith("webroot/")) return; // Only allow paths starting with "webroot/"
    
        filePath = filePath.slice(8); // Remove "webroot/" prefix
    
        const index = this.fileHistory.indexOf(filePath);
        if (index !== -1) this.fileHistory.splice(index, 1); // Remove existing entry
    
        this.fileHistory.unshift(filePath); // Add to the top
    
        if (this.fileHistory.length > this.MAX_HISTORY) this.fileHistory.pop(); // Maintain max history size
    
        this.refresh();
    }
    

    getTreeItem(element) {
        let treeItem = new vscode.TreeItem(element.label, vscode.TreeItemCollapsibleState.None);
        treeItem.tooltip = element.tooltip;
        treeItem.command = {
            command: "ambientextension.openFile",
            title: "Open File",
            arguments: [element.tooltip] // Full file path
        };
        return treeItem;
    }

    getChildren() {
        return this.fileHistory.map(file => ({
            label: vscode.workspace.asRelativePath(file),
            tooltip: file
        }));
    }
}    

// --- JS FILE TREEVIEW ---
class MethodTreeProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.activeFile = null;
    }

    refresh() {
        this._onDidChangeTreeData.fire();                
    }

    setActiveFile(filePath) {
        this.activeFile = filePath;
        this.refresh();
    }

    getTreeItem(element) {
        return element
    }

    async getChildren(element) {
        if (!this.activeFile) return [];

        if (!element) {
            return await this.getClassAndMethods(this.activeFile);
        } else if (element instanceof JsClassItem) {
            return element.methods.map(method => new JsMethodItem(method, element.filePath));
        } else {
            return [];
        }
    }    

    async getClassAndMethods(filePath) {
        try {
            const fileData = await fileinfo(filePath);  // Await if async
            if (!Array.isArray(fileData)) { return []; }
            var result = fileData.map(classItem => new JsClassItem(classItem, filePath))
            return result

        } catch (error) {
            console.error("Error getting class and methods:", error);
            return [];
        }
    }    
}


    // getChildren(element) {
    //     // if (!element) {
    //     //     // Return only JavaScript files from the workspace
    //     //     return vscode.workspace.findFiles("**/*.js").then(files => 
    //     //         files.map(file => new JsFileItem(file))
    //     //     );
    //     // } else if (element instanceof JsFileItem) {
    //     //     // Extract class and method info from the file
    //     //     return this.getClassAndMethods(element.resourceUri.fsPath);
    //     // } else if (element.type === "class") {
    //     //     // Show methods under a class
    //     //     return element.methods.map(method => new JsMethodItem(method, element.filePath));
    //     // }
    //     // return [];
    // }  
    
    
    // getTreeItem(element) {
    //     let treeItem = new vscode.TreeItem(element.name);
    //     treeItem.collapsibleState = element.methods ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None;
    //     if (element.linenum) {
    //         treeItem.command = {
    //             command: "ambientextension.gotoLine",
    //             title: "Go to Line",
    //             arguments: [element.linenum]
    //         };
    //     }
    //     return treeItem;
    // }


module.exports = { FileHistoryProvider, MethodTreeProvider };




// Class node
class JsClassItem extends vscode.TreeItem {
    constructor(classData, filePath) {
        super(classData.name, vscode.TreeItemCollapsibleState.Expanded);
        this.filePath = filePath;
        this.type = "class";
        this.methods = classData.methods;
        this.command = {
            command: "ambientextension.gotoLine",
            title: "Go to Line",
            arguments: [classData.linenum]
        };
    }
}

// Method node
class JsMethodItem extends vscode.TreeItem {
    constructor(method, filePath) {
        super(method.name, vscode.TreeItemCollapsibleState.None);
        this.filePath = filePath;
        this.command = {
            command: "ambientextension.gotoLine",
            title: "Go to Line",
            arguments: [method.linenum]
        };
    }
}

// module.exports = TreeProvider;
