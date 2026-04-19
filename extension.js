const vscode = require("vscode");
const { supprLigne } = require("./modifLigne");
const { calcComplexitePy } = require("./python");

function activate(context) {
  vscode.window.showInformationMessage(`L'extension est activée`);

  let complex = vscode.commands.registerCommand(
    "complexity-calculator.complex",
    () => {
      const editor = vscode.window.activeTextEditor;
      const document = editor.document;
      const languageId = document.languageId;

      if (languageId == "python") {
        vscode.window.showInformationMessage("Calcul de la complexitée");
        calcComplexitePy(document);
      }
    },
  );

  let decom = vscode.commands.registerCommand(
    "complexity-calculator.decom",
    () => {
      const editor = vscode.window.activeTextEditor;
      const document = editor.document;
      const languageId = document.languageId;

      if (languageId == "python") {
        for (let i = 0; i < document.lineCount; ++i) {
          supprLigne(document, "1", i, "#");
        }
      }
    },
  );
  context.subscriptions.push(complex);
  context.subscriptions.push(decom);
}

function deactivate() {}
module.exports = { activate, deactivate };
