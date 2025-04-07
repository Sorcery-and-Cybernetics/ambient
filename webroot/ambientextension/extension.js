const vscode = require("vscode");

const { FileHistoryProvider, MethodTreeProvider } = require("./treeprovider");

function activate(context) {
    let fileHistoryProvider = new FileHistoryProvider();
    let methodTreeProvider = new MethodTreeProvider();

    vscode.window.registerTreeDataProvider("ambientextension.filehistory", fileHistoryProvider);
    vscode.window.registerTreeDataProvider("ambientextension.methodtree", methodTreeProvider);

    vscode.commands.registerCommand("ambientextension.gotoLine", (line) => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const position = new vscode.Position(line - 1, 0);
            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(new vscode.Range(position, position));
        }
    });

    vscode.commands.registerCommand("ambientextension.openFile", (filePath) => {
        vscode.workspace.openTextDocument(filePath).then(doc => {
            vscode.window.showTextDocument(doc);
        });
    });

    vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            let filePath = editor.document.uri.fsPath;

            if (editor.document.languageId === "javascript") {
                fileHistoryProvider.addFile(filePath);
                methodTreeProvider.setActiveFile(filePath);
            }
        }
    });
}

function deactivate() {}

module.exports = { activate, deactivate };