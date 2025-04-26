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
        const webrootIndex = filePath.indexOf("webroot\\");
        if (webrootIndex === -1) return; // Invalid file if "webroot/" is not in the path
    
        const truncatedPath = filePath.slice(webrootIndex + 8); // Strip filepath before and including "webroot/"
    
        const index = this.fileHistory.findIndex(item => item.full === filePath);
        if (index !== -1) this.fileHistory.splice(index, 1); // Remove existing entry
    
        this.fileHistory.unshift({
            truncated: truncatedPath,
            full: filePath
        }); // Add to the top
    
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
            label: file.truncated,
            tooltip: file.full
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
        return element;
    }

    async getChildren(element) {
        if (!this.activeFile) return [];

        if (!element) {
            const fileData = await fileinfo(this.activeFile);
            if (!fileData || !Array.isArray(fileData)) return [];
            
            // Skip the module level and directly return its scope
            const moduleScope = fileData[0]?.scope || [];
            return moduleScope.map(item => new TreeItem(item, this.activeFile));
        } else if (element.data.scope) {
            return element.data.scope.map(item => new TreeItem(item, this.activeFile));
        }
        
        return [];
    }
}

class TreeItem extends vscode.TreeItem {
    constructor(data, filePath) {
        super(
            data.name,
            data.scope ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None
        );

        this.data = data;
        this.filePath = filePath;
        
        // Set icon based on type
        switch (data.type) {
            case 'object':
                this.iconPath = new vscode.ThemeIcon('symbol-class');
                break;
            case 'method':
                this.iconPath = new vscode.ThemeIcon('symbol-method');
                break;
            case 'trait':
                this.iconPath = new vscode.ThemeIcon('symbol-property');
                break;
            case 'behavior':
                this.iconPath = new vscode.ThemeIcon('symbol-namespace');
                break;
            case 'function':
                this.iconPath = new vscode.ThemeIcon('symbol-function');
                break;
            case 'enum':
                this.iconPath = new vscode.ThemeIcon('symbol-enum');
                break;
            case 'eventhandler':
                this.iconPath = new vscode.ThemeIcon('symbol-event');
                break;
            
        }

        // Add line number navigation command
        if (data.linenum) {
            this.command = {
                command: 'ambientextension.gotoLine',
                title: 'Go to Line',
                arguments: [data.linenum]
            };
        }
    }
}

module.exports = { FileHistoryProvider, MethodTreeProvider };
